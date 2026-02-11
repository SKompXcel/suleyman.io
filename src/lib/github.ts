import { slugify } from './slugify'

const GITHUB_USERNAME =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME || process.env.GITHUB_USERNAME || 'kianis4'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''
const DEFAULT_LIMIT = 40

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  private: boolean
  fork: boolean
  archived: boolean
  updated_at: string
  pushed_at: string
  created_at: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  watchers_count: number
  topics: string[]
  homepage: string | null
  default_branch: string
  language: string | null
}

export interface NormalizedRepo {
  id: number
  slug: string
  githubSlug: string
  name: string
  description: string
  link: { href: string; label: string }
  github: string
  logo: null
  timeframe: string
  tech: string[]
  featured: boolean
  priority: number
  badges: string[]
  source: 'github'
  visibility: 'private' | 'public'
  stats: {
    stars: number
    forks: number
    issues: number
    watchers: number
  }
  updatedAt: string
  createdAt: string
  topics: string[]
  homepage: string | null
  defaultBranch: string
}

interface FetchOptions {
  limit?: number
  includeForks?: boolean
  includePrivate?: boolean
}

export async function fetchGitHubRepos({
  limit = DEFAULT_LIMIT,
  includeForks = false,
  includePrivate = false,
}: FetchOptions = {}): Promise<NormalizedRepo[]> {
  const baseUrl = includePrivate
    ? 'https://api.github.com/installation/repositories'
    : `https://api.github.com/users/${GITHUB_USERNAME}/repos`
  const url = new URL(baseUrl)
  url.searchParams.set('per_page', '100')
  if (!includePrivate) {
    url.searchParams.set('sort', 'updated')
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
  }

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`
  } else if (includePrivate) {
    throw new Error('GITHUB_TOKEN is required to include private repositories')
  }

  const response = await fetch(url.toString(), { headers })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(`GitHub API error: ${response.status} ${payload.message || ''}`.trim())
  }

  const payload = await response.json()
  const repos: GitHubRepo[] = includePrivate ? payload.repositories || [] : payload

  const filtered = repos
    .filter((repo) => includePrivate || !repo.private)
    .filter((repo) => includeForks || !repo.fork)
    .filter((repo) => !repo.archived)
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())

  return filtered.slice(0, limit).map(normalizeRepo)
}

function normalizeRepo(repo: GitHubRepo): NormalizedRepo {
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

function prettifyName(name: string = ''): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim()
}

function deriveLink(repo: GitHubRepo): { href: string; label: string } {
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

function buildTechList(repo: GitHubRepo): string[] {
  const tags = new Set<string>()

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

function formatTag(tag: string): string {
  return tag
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatMonthYear(dateString: string): string {
  if (!dateString) return 'Recently updated'
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}
