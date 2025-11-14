import { projectOverrides, customProjects } from '@/data/projects'
import { fetchGitHubRepos } from './github'
import { slugify } from './slugify'

const INCLUDE_PRIVATE_REPOS =
  (process.env.GITHUB_INCLUDE_PRIVATE || process.env.NEXT_PUBLIC_GITHUB_INCLUDE_PRIVATE || '').toLowerCase() ===
  'true'

export async function getProjectsData() {
  let githubProjects = []

  try {
    githubProjects = await fetchGitHubRepos({
      limit: 80,
      includePrivate: INCLUDE_PRIVATE_REPOS,
    })
  } catch (error) {
    if (INCLUDE_PRIVATE_REPOS) {
      console.warn(
        '[projects] Falling back to public repos because the GitHub App token could not access private repositories. ' +
          'Full error: ',
        error.message
      )

      githubProjects = await fetchGitHubRepos({ limit: 80, includePrivate: false })
    } else {
      throw error
    }
  }
  const mergedGithub = githubProjects.map(applyOverride)
  const custom = customProjects.map(normalizeCustomProject)

  const combined = dedupeBySlug([...mergedGithub, ...custom])

  return combined
}

function applyOverride(project) {
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

function normalizeCustomProject(project) {
  return {
    id: project.slug,
    slug: project.slug || slugify(project.name),
    githubSlug: null,
    name: project.name,
    description: project.description,
    link: project.link,
    github: project.github || null,
    logo: project.logo || null,
    timeframe: project.timeframe || 'Ongoing',
    tech: project.tech || [],
    featured: Boolean(project.featured),
    priority: project.priority ?? 99,
    badges: project.badges || ['Client Work'],
    source: project.source || 'custom',
  visibility: project.visibility || 'private',
    stats: project.stats || null,
    updatedAt: project.updatedAt || deriveDateFromTimeframe(project.timeframe),
    createdAt: project.createdAt || null,
  }
}

function dedupeBySlug(projects) {
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

function deriveDateFromTimeframe(timeframe) {
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
