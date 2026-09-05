export type CollaboratorKind = 'client' | 'collaborator';

export type Collaborator = {
  id: string;
  nameKey: string;
  kind: CollaboratorKind;
};

/**
 * Drop logo files in `public/images/collaborators/` using the id as the filename:
 *   dar-al-qamar.svg | .png | .webp | .jpg
 * The first matching file is used. Until a file is added, the name shows as a wordmark.
 */
export const COLLABORATOR_LOGO_EXTS = ['svg', 'png', 'webp', 'jpg'] as const;

export const homeCollaborators = [
  { id: 'dar-al-qamar', nameKey: 'darAlQamar', kind: 'client' },
  { id: 'atelier-hanan', nameKey: 'atelierHanan', kind: 'collaborator' },
  { id: 'quiet-court', nameKey: 'quietCourt', kind: 'client' },
  { id: 'maison-wadi', nameKey: 'maisonWadi', kind: 'client' },
  { id: 'studio-saffron', nameKey: 'studioSaffron', kind: 'collaborator' },
  { id: 'olive-court', nameKey: 'oliveCourt', kind: 'client' },
  { id: 'al-mada', nameKey: 'alMada', kind: 'collaborator' },
  { id: 'cedar-house', nameKey: 'cedarHouse', kind: 'client' },
  { id: 'gulf-light', nameKey: 'gulfLight', kind: 'collaborator' },
  { id: 'long-table', nameKey: 'longTable', kind: 'client' },
  { id: 'north-residences', nameKey: 'northResidences', kind: 'client' },
  { id: 'qasr-studio', nameKey: 'qasrStudio', kind: 'collaborator' },
] as const satisfies readonly Collaborator[];

export function collaboratorLogoCandidates(id: string): string[] {
  return COLLABORATOR_LOGO_EXTS.map(
    (ext) => `/images/collaborators/${id}.${ext}`,
  );
}

export function resolveCollaboratorLogo(
  id: string,
  exists: (path: string) => boolean,
): string | null {
  return collaboratorLogoCandidates(id).find((path) => exists(path)) ?? null;
}
