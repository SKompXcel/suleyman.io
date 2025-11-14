import { slugify } from './slugify'

const GITHUB_USERNAME =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME || process.env.GITHUB_USERNAME || 'kianis4'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''
const DEFAULT_LIMIT = 40

export async function fetchGitHubRepos({
  limit = DEFAULT_LIMIT,
  includeForks = false,
  includePrivate = false,
} = {}) {
  const baseUrl = includePrivate
    ? 'https://api.github.com/installation/repositories'
    : `https://api.github.com/users/${GITHUB_USERNAME}/repos`
  const url = new URL(baseUrl)
  url.searchParams.set('per_page', '100')
  if (!includePrivate) {
    url.searchParams.set('sort', 'updated')
  }

  const headers = {
    Accept: 'application/vnd.github+json',
  }

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`
  } else if (includePrivate) {
    throw new Error('GITHUB_TOKEN is required to include private repositories')
  }

  const response = await fetch(url, { headers })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(`GitHub API error: ${response.status} ${payload.message || ''}`.trim())
  }

  const payload = await response.json()
  const repos = includePrivate ? payload.repositories || [] : payload

  const filtered = repos
    .filter((repo) => includePrivate || !repo.private)
    .filter((repo) => includeForks || !repo.fork)
    .filter((repo) => !repo.archived)
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())

  return filtered.slice(0, limit).map(normalizeRepo)
}

function normalizeRepo(repo) {
  return {
    id: repo.id,
    slug: slugify(repo.name),
    githubSlug: repo.full_name.toLowerCase(),
    name: prettifyName(repo.name),
    description:
      repo.description ||
      'Open-source project currently being documented. Check back soon for more details.',
    link: deriveLink(repo),
    github: repo.html_url,
    logo: null,
    timeframe: `Updated ${formatMonthYear(repo.pushed_at)}`,
    tech: buildTechList(repo),
    featured: false,
    priority: 99,
    badges: ['Open Source'],
    source: 'github',
    visibility: repo.private ? 'private' : 'public',
    stats: {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      issues: repo.open_issues_count,
      watchers: repo.watchers_count,
    },
    updatedAt: repo.pushed_at,
    createdAt: repo.created_at,
    topics: repo.topics || [],
    homepage: repo.homepage,
    defaultBranch: repo.default_branch,
  }
}

function prettifyName(name = '') {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim()
}

function deriveLink(repo) {
  if (repo.homepage) {
    try {
      const url = new URL(repo.homepage)
      return { href: repo.homepage, label: url.host }
    } catch (e) {
      return { href: repo.html_url, label: repo.full_name }
    }
  }

  return { href: repo.html_url, label: repo.full_name }
}

function buildTechList(repo) {
  const tags = new Set()

  if (repo.language) {
    tags.add(repo.language)
  }

  if (Array.isArray(repo.topics)) {
    repo.topics.forEach((topic) => {
      if (topic) {
        tags.add(formatTag(topic))
      }
    })
  }

  return Array.from(tags)
}

function formatTag(tag) {
  return tag
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatMonthYear(dateString) {
  if (!dateString) return 'Recently updated'
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}
