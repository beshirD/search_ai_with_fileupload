const mapping: Record<string, string> = {
  answers: 'answer',
  documentations: 'documentation',
  invitations: 'invitation',
  organizations: 'organization',
  searches: 'search',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
