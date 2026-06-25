export default async function sitemap() {
  const baseUrl = 'https://zeeshanaluminum.com';

  // Dynamic project routes could be fetched from API here if needed, 
  // but we can generate default placeholder/static ones plus static pages.
  const routes = [
    '',
    '/tv-cabinets',
    '/aluminum-work',
    '/interior-work',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return routes;
}
