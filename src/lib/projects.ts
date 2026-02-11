import { projectOverrides, customProjects, CustomProject } from '@/data/projects'
import { fetchGitHubRepos, NormalizedRepo } from './github'
import { slugify } from './slugify'

const INCLUDE_PRIVATE_REPOS =
  (process.env.GITHUB_INCLUDE_PRIVATE || process.env.NEXT_PUBLIC_GITHUB_INCLUDE_PRIVATE || '').toLowerCase() ===
  'true'

export type Project = CustomProject | NormalizedRepo

export async function getProjectsData(): Promise<Project[]> {
  let githubProjects: NormalizedRepo[] = []

  try {
    githubProjects = await fetchGitHubRepos({
      limit: 80,
      includePrivate: INCLUDE_PRIVATE_REPOS,
    })
  } catch (error: any) {
    console.warn('[projects] GitHub fetch failed:', error.message)

    if (INCLUDE_PRIVATE_REPOS) {
      try {
        console.warn(
          '[projects] Falling back to public repos because the GitHub App token could not access private repositories.'
        )
        githubProjects = await fetchGitHubRepos({ limit: 80, includePrivate: false })
      } catch (fallbackError: any) {
        console.warn('[projects] Fallback to public repos also failed:', fallbackError.message)
        githubProjects = []
      }
    } else {
      // Don't crash the build if GitHub fails
      console.warn('[projects] Continuing with only custom projects.')
      githubProjects = []
    }
  }
  const mergedGithub = githubProjects.map(applyOverride)
  const custom = customProjects.map(normalizeCustomProject)

  const combined = dedupeBySlug([...mergedGithub, ...custom])

  return combined
}

function applyOverride(project: NormalizedRepo): any {
  const override = projectOverrides[project.githubSlug]

  if (!override) {
    return project
  }

  return {
    ...project,
    ...override,
    link: override.link || project.link,
    logo: override.logo ?? project.logo,
    timeframe: override.timeframe || project.timeframe,
    tech: override.tech || project.tech,
    featured: override.featured ?? project.featured,
    priority: override.priority ?? project.priority,
    badges: override.badges || project.badges,
    visibility: override.visibility || project.visibility,
  }
}

function normalizeCustomProject(project: CustomProject): CustomProject {
  return {
    ...project,
    id: (project as any).id || project.slug,
    slug: project.slug || slugify(project.name),
    githubSlug: null,
    github: project.github || null,
    logo: project.logo || null,
    timeframe: project.timeframe || 'Ongoing',
    tech: project.tech || [],
    featured: Boolean(project.featured),
    priority: project.priority ?? 99,
    badges: project.badges || ['Client Work'],
    source: project.source || 'custom',
    visibility: project.visibility || 'private',
    stats: (project as any).stats || null,
    updatedAt: (project as any).updatedAt || deriveDateFromTimeframe(project.timeframe),
    createdAt: (project as any).createdAt || null,
  } as CustomProject
}

function dedupeBySlug(projects: any[]): Project[] {
  const seen = new Map()

  projects.forEach((project) => {
    const key = project.githubSlug || project.slug

    if (!seen.has(key)) {
      seen.set(key, project)
      return
    }

    const existing = seen.get(key)
    seen.set(key, {
      ...existing,
      ...project,
      tech: project.tech && project.tech.length ? project.tech : existing.tech,
    })
  })

  return Array.from(seen.values())
}

function deriveDateFromTimeframe(timeframe: string): string | null {
  if (!timeframe) {
    return null
  }

  const monthYearRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}/gi
  const matches = timeframe.match(monthYearRegex)

  if (matches && matches.length) {
    return new Date(matches[matches.length - 1]).toISOString()
  }

  const yearRegex = /(19|20)\d{2}/g
  const yearMatches = timeframe.match(yearRegex)

  if (yearMatches && yearMatches.length) {
    return new Date(`${yearMatches[yearMatches.length - 1]}-01-01`).toISOString()
  }

  return null
}
