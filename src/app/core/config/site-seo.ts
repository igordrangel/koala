export const SITE_URL = 'https://koalarx.com';

export function absoluteSiteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
