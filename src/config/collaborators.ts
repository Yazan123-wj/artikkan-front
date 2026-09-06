export type CollaboratorKind = 'client' | 'collaborator';

export type Collaborator = {
  id: string;
  nameKey: string;
  kind: CollaboratorKind;
  logoId?: string;
};

/**
 * Logo files live in `public/images/collaborators/{logoId|id}.png`.
 */
export const COLLABORATOR_LOGO_EXTS = ['svg', 'png', 'webp', 'jpg'] as const;

export const homeCollaborators = [
  { id: 'qatar-airways', nameKey: 'qatarAirways', kind: 'client' },
  { id: 'barzan-holdings', nameKey: 'barzanHoldings', kind: 'client' },
  { id: 'sharq-law-firm', nameKey: 'sharqLawFirm', kind: 'client' },
  { id: 'the-group', nameKey: 'theGroup', kind: 'collaborator' },
  { id: 'qatar-foundation', nameKey: 'qatarFoundation', kind: 'client' },
  { id: 'memac-ogilvy', nameKey: 'memacOgilvy', kind: 'collaborator' },
  {
    id: 'power-international-holding',
    nameKey: 'powerInternationalHolding',
    kind: 'client',
  },
  { id: 'qfb', nameKey: 'qfb', kind: 'client' },
  { id: 'qia', nameKey: 'qia', kind: 'client' },
  { id: 'st-regis', nameKey: 'stRegis', kind: 'client' },
  { id: 'qdb', nameKey: 'qdb', kind: 'client' },
  {
    id: 'qatar-airways-2',
    nameKey: 'qatarAirways',
    kind: 'client',
    logoId: 'qatar-airways',
  },
] as const satisfies readonly Collaborator[];

export function collaboratorLogoCandidates(id: string): string[] {
  return COLLABORATOR_LOGO_EXTS.map(
    (ext) => `/images/collaborators/${id}.${ext}`,
  );
}

export function resolveCollaboratorLogo(
  item: Pick<Collaborator, 'id' | 'logoId'>,
  exists: (path: string) => boolean,
): string | null {
  return (
    collaboratorLogoCandidates(item.logoId ?? item.id).find((path) =>
      exists(path),
    ) ?? null
  );
}
