export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function generatePackageUrl(tourType: 'FIT' | 'GIT', slug: string): string {
  const basePath = tourType === 'FIT' ? '/packages/bestseller' : '/packages/Upcoming-Group-Trips';
  return `${basePath}/${slug}`;
}