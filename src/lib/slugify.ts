export function slugify(value: string | number = ''): string {
  return value
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .toLowerCase()
}
