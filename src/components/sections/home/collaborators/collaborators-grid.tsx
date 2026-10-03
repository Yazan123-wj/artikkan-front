import Image from 'next/image';

export type CollaboratorGridItem = {
  id: string;
  name: string;
  kindLabel: string;
  logoSrc: string | null;
};

type CollaboratorsGridProps = {
  items: readonly CollaboratorGridItem[];
};

export function CollaboratorsGrid({ items }: CollaboratorsGridProps) {
  return (
    <ul className="home-collaborators-grid">
      {items.map((item) => (
        <li key={item.id} className="home-collaborators-cell" data-collaborator>
          <span className="home-collaborators-kind type-label">{item.kindLabel}</span>
          <div className="home-collaborators-mark">
            {item.logoSrc ? (
              <Image
                src={item.logoSrc}
                alt={item.name}
                width={220}
                height={88}
                className="home-collaborators-logo"
                sizes="176px"
              />
            ) : (
              <span className="home-collaborators-wordmark">{item.name}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
