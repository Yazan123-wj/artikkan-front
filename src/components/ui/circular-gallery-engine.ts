import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
  type OGLRenderingContext,
} from 'ogl';

export type CircularGalleryItem = {
  image: string;
  text: string;
};

export type CircularGalleryAppOptions = {
  items: readonly CircularGalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
};

type ScreenSize = {
  width: number;
  height: number;
};

type ViewportSize = {
  width: number;
  height: number;
};

type ScrollState = {
  ease: number;
  current: number;
  target: number;
  last: number;
  position: number;
};

function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * amount;
}

function getFontSize(font: string): number {
  const match = font.match(/(\d+)px/);
  return match ? Number.parseInt(match[1], 10) : 22;
}

export function resolveSiteFont(sizePx = 22): string {
  const family = getComputedStyle(document.body).fontFamily || 'sans-serif';
  return `500 ${sizePx}px ${family}`;
}

function createTextTexture(
  gl: OGLRenderingContext,
  text: string,
  font: string,
  color: string,
  rtl: boolean,
): { texture: Texture; width: number; height: number } {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    const texture = new Texture(gl, { generateMipmaps: false });
    return { texture, width: 1, height: 1 };
  }

  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(getFontSize(font) * 1.2);
  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.direction = rtl ? 'rtl' : 'ltr';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  mesh: Mesh;

  constructor({
    gl,
    plane,
    text,
    textColor,
    font,
    rtl,
  }: {
    gl: OGLRenderingContext;
    plane: Mesh;
    text: string;
    textColor: string;
    font: string;
    rtl: boolean;
  }) {
    const { texture, width, height } = createTextTexture(
      gl,
      text,
      font,
      textColor,
      rtl,
    );
    const geometry = new Plane(gl);
    const program = new Program(gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });

    this.mesh = new Mesh(gl, { geometry, program });
    const aspect = width / Math.max(height, 1);
    const textHeight = plane.scale.y * 0.12;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -plane.scale.y * 0.5 - textHeight * 0.5 - 0.05;
    this.mesh.setParent(plane);
  }
}

class Media {
  extra = 0;
  geometry: Plane;
  gl: OGLRenderingContext;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  viewport: ViewportSize;
  bend: number;
  textColor: string;
  borderRadius: number;
  font: string;
  rtl: boolean;
  program!: Program;
  plane!: Mesh;
  width = 0;
  widthTotal = 0;
  x = 0;
  padding = 2;
  scale = 1;

  constructor(options: {
    geometry: Plane;
    gl: OGLRenderingContext;
    image: string;
    index: number;
    length: number;
    renderer: Renderer;
    scene: Transform;
    screen: ScreenSize;
    text: string;
    viewport: ViewportSize;
    bend: number;
    textColor: string;
    borderRadius: number;
    font: string;
    rtl: boolean;
  }) {
    this.geometry = options.geometry;
    this.gl = options.gl;
    this.image = options.image;
    this.index = options.index;
    this.length = options.length;
    this.renderer = options.renderer;
    this.scene = options.scene;
    this.screen = options.screen;
    this.text = options.text;
    this.viewport = options.viewport;
    this.bend = options.bend;
    this.textColor = options.textColor;
    this.borderRadius = options.borderRadius;
    this.font = options.font;
    this.rtl = options.rtl;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5)
            * (0.04 + uSpeed * 0.22);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [1, 1] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });

    const img = new Image();
    img.decoding = 'async';
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [
        img.naturalWidth,
        img.naturalHeight,
      ];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    if (!this.text.trim()) {
      return;
    }

    new Title({
      gl: this.gl,
      plane: this.plane,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
      rtl: this.rtl,
    });
  }

  update(
    scroll: ScrollState,
    direction: 'left' | 'right',
  ) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const half = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const bendAbs = Math.abs(this.bend);
      const radius = (half * half + bendAbs * bendAbs) / (2 * bendAbs);
      const effectiveX = Math.min(Math.abs(x), half);
      const arc = radius - Math.sqrt(radius * radius - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / radius);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / radius);
      }
    }

    const speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    const isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    const isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && isBefore) {
      this.extra -= this.widthTotal;
    }
    if (direction === 'left' && isAfter) {
      this.extra += this.widthTotal;
    }
  }

  onResize({
    screen,
    viewport,
  }: {
    screen?: ScreenSize;
    viewport?: ViewportSize;
  } = {}) {
    if (screen) {
      this.screen = screen;
    }
    if (viewport) {
      this.viewport = viewport;
    }

    this.scale = this.screen.height / 1500;
    this.plane.scale.y =
      (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x =
      (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

export class CircularGalleryApp {
  container: HTMLElement;
  scrollSpeed: number;
  scroll: ScrollState;
  renderer!: Renderer;
  gl!: OGLRenderingContext;
  camera!: Camera;
  scene!: Transform;
  screen: ScreenSize = { width: 1, height: 1 };
  viewport: ViewportSize = { width: 1, height: 1 };
  planeGeometry!: Plane;
  medias: Media[] = [];
  raf = 0;
  visible = true;
  isDown = false;
  startX = 0;
  startY = 0;
  dragAxis: 'x' | 'y' | null = null;
  rtl: boolean;
  autoplay: boolean;
  autoplaySpeed: number;
  private lastTick = 0;
  private boundOnResize: () => void;
  private boundOnPointerDown: (event: PointerEvent) => void;
  private boundOnPointerMove: (event: PointerEvent) => void;
  private boundOnPointerUp: (event: PointerEvent) => void;
  private boundOnKeyDown: (event: KeyboardEvent) => void;
  private resizeObserver?: ResizeObserver;

  constructor(container: HTMLElement, options: CircularGalleryAppOptions) {
    this.container = container;
    this.scrollSpeed = options.scrollSpeed ?? 2;
    this.autoplay = options.autoplay ?? true;
    this.autoplaySpeed = options.autoplaySpeed ?? 0.014;
    this.rtl = document.documentElement.dir === 'rtl';
    this.scroll = {
      ease: options.scrollEase ?? 0.05,
      current: 0,
      target: 0,
      last: 0,
      position: 0,
    };
    this.boundOnResize = () => this.onResize();
    this.boundOnPointerDown = (event) => this.onPointerDown(event);
    this.boundOnPointerMove = (event) => this.onPointerMove(event);
    this.boundOnPointerUp = () => this.onPointerUp();
    this.boundOnKeyDown = (event) => this.onKeyDown(event);

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(options);
    this.addEventListeners();
    this.update();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.canvas.setAttribute('aria-hidden', 'true');
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }

  createMedias(options: CircularGalleryAppOptions) {
    const source = options.items;
    if (!source.length) {
      return;
    }

    const galleryItems = [...source, ...source];
    this.medias = galleryItems.map(
      (item, index) =>
        new Media({
          geometry: this.planeGeometry,
          gl: this.gl,
          image: item.image,
          index,
          length: galleryItems.length,
          renderer: this.renderer,
          scene: this.scene,
          screen: this.screen,
          text: item.text,
          viewport: this.viewport,
          bend: options.bend ?? 3,
          textColor: options.textColor ?? '#161616',
          borderRadius: options.borderRadius ?? 0.02,
          font: options.font ?? resolveSiteFont(),
          rtl: this.rtl,
        }),
    );
  }

  onPointerDown(event: PointerEvent) {
    this.isDown = true;
    this.dragAxis = null;
    this.scroll.position = this.scroll.current;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.container.setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent) {
    if (!this.isDown) {
      return;
    }

    const dx = this.startX - event.clientX;
    const dy = this.startY - event.clientY;
    if (!this.dragAxis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) {
        return;
      }
      this.dragAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }

    if (this.dragAxis === 'y') {
      return;
    }

    event.preventDefault();
    const direction = this.rtl ? -1 : 1;
    this.scroll.target =
      this.scroll.position + dx * (this.scrollSpeed * 0.025) * direction;
  }

  onPointerUp() {
    this.isDown = false;
    this.dragAxis = null;
    this.lastTick = performance.now();
  }

  onKeyDown(event: KeyboardEvent) {
    const next = this.rtl ? 'ArrowLeft' : 'ArrowRight';
    const prev = this.rtl ? 'ArrowRight' : 'ArrowLeft';

    if (event.key === next) {
      event.preventDefault();
      this.scroll.target += this.scrollSpeed * 5;
      return;
    }

    if (event.key === prev) {
      event.preventDefault();
      this.scroll.target -= this.scrollSpeed * 5;
    }
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth || 1,
      height: this.container.clientHeight || 1,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * Math.abs(this.camera.position.z);
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    this.medias.forEach((media) =>
      media.onResize({ screen: this.screen, viewport: this.viewport }),
    );
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    this.lastTick = performance.now();
    if (visible && !this.raf) {
      this.update();
    }
    if (!visible && this.raf) {
      window.cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  update = () => {
    if (!this.visible) {
      this.raf = 0;
      return;
    }

    const now = performance.now();
    const dt = Math.min((now - (this.lastTick || now)) / 16.667, 2.5);
    this.lastTick = now;

    if (this.autoplay && !this.isDown) {
      const direction = this.rtl ? -1 : 1;
      this.scroll.target += this.autoplaySpeed * dt * direction;
    }

    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.isDown ? 0.22 : this.scroll.ease,
    );
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    this.medias.forEach((media) => media.update(this.scroll, direction));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update);
  };

  addEventListeners() {
    window.addEventListener('resize', this.boundOnResize);
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.container);
    this.container.addEventListener('pointerdown', this.boundOnPointerDown);
    this.container.addEventListener('pointermove', this.boundOnPointerMove);
    this.container.addEventListener('pointerup', this.boundOnPointerUp);
    this.container.addEventListener('pointercancel', this.boundOnPointerUp);
    this.container.addEventListener('keydown', this.boundOnKeyDown);
  }

  destroy() {
    this.visible = false;
    window.cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.resizeObserver?.disconnect();
    window.removeEventListener('resize', this.boundOnResize);
    this.container.removeEventListener('pointerdown', this.boundOnPointerDown);
    this.container.removeEventListener('pointermove', this.boundOnPointerMove);
    this.container.removeEventListener('pointerup', this.boundOnPointerUp);
    this.container.removeEventListener('pointercancel', this.boundOnPointerUp);
    this.container.removeEventListener('keydown', this.boundOnKeyDown);

    const canvas = this.gl?.canvas;
    if (canvas?.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }

    this.gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
