'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import {
  SiDjango,
  SiFlutter,
  SiGooglechrome,
  SiNodedotjs,
  SiOpenai,
  SiPython,
  SiReact,
  SiSwift,
  SiTypescript,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'
import { HiOutlineCodeBracketSquare } from 'react-icons/hi2'
import { FiServer } from 'react-icons/fi'
import { LuBot, LuCalendarDays } from 'react-icons/lu'
import { MdPhoneIphone } from 'react-icons/md'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { GitHubIcon } from '@/components/SocialIcons'
import { Project } from '@/lib/projects'
import type { ProjectLogo } from '@/data/projects'

const VIEW_FILTERS = [
  { label: 'All work', value: 'all' },
  { label: 'Open source', value: 'open-source' },
  { label: 'Client work', value: 'client' },
]

const SORT_OPTIONS = [
  { label: 'Recently updated', value: 'recent' },
  { label: 'Most popular', value: 'popular' },
  { label: 'A → Z', value: 'alphabetical' },
]

const PROJECT_ICONS: Record<string, any> = {
  ai: LuBot,
  calendar: LuCalendarDays,
  chrome: SiGooglechrome,
  code: HiOutlineCodeBracketSquare,
  django: SiDjango,
  flutter: SiFlutter,
  java: FaJava,
  mobile: MdPhoneIphone,
  node: SiNodedotjs,
  openai: SiOpenai,
  python: SiPython,
  react: SiReact,
  server: FiServer,
  swift: SiSwift,
  typescript: SiTypescript,
}

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.656 0l-1.06-1.06a2.5 2.5 0 0 1-3.536 0l-1.06 1.06Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ProjectLogo({ logo, name }: { logo: ProjectLogo | null, name: string }) {
  if (!logo) {
    return <span className="text-sm font-semibold text-blue-600">{getFallbackInitials(name)}</span>
  }

  if (typeof logo === 'string') {
    return (
      <Image
        src={logo}
        alt={name}
        width={32}
        height={32}
        className="h-8 w-8 object-contain"
        unoptimized
      />
    )
  }

  if (logo?.type === 'image' && logo.src) {
    return (
      <Image
        src={logo.src}
        alt={name}
        width={32}
        height={32}
        className="h-8 w-8 object-contain"
        unoptimized
      />
    )
  }

  if (logo?.type === 'icon' && logo.name) {
    const IconComponent = PROJECT_ICONS[logo.name.toLowerCase()]

    if (IconComponent) {
      return <IconComponent className={clsx('h-7 w-7', logo.className)} />
    }
  }

  if (logo?.src) {
    return (
      <Image
        src={logo.src}
        alt={name}
        width={32}
        height={32}
        className="h-8 w-8 object-contain"
        unoptimized
      />
    )
  }

  return <span className="text-sm font-semibold text-blue-600">{getFallbackInitials(name)}</span>
}

function getFallbackInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
    .padEnd(2, '•')
}

function sortProjects(projects: Project[], sortOption: string) {
  const items = [...projects]

  if (sortOption === 'alphabetical') {
    return items.sort((a, b) => a.name.localeCompare(b.name))
  }

  if (sortOption === 'popular') {
    return items.sort(
      (a, b) => (b.stats?.stars ?? 0) - (a.stats?.stars ?? 0)
    )
  }

  return items.sort((a, b) => {
    const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
    const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
    return bTime - aTime
  })
}

function formatNumber(value = 0) {
  if (!value) return '0'
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function formatRelativeTime(dateString: string) {
  if (!dateString) {
    return 'Recently'
  }

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return 'Recently'
  }

  const diffMs = date.getTime() - Date.now()
  const minute = 60 * 1000
  const hour = minute * 60
  const day = hour * 24
  const month = day * 30
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (Math.abs(diffMs) < hour) {
    return rtf.format(Math.round(diffMs / minute), 'minute')
  }

  if (Math.abs(diffMs) < day) {
    return rtf.format(Math.round(diffMs / hour), 'hour')
  }

  if (Math.abs(diffMs) < month) {
    return rtf.format(Math.round(diffMs / day), 'day')
  }

  return rtf.format(Math.round(diffMs / month), 'month')
}

function formatMonthYear(dateString: string) {
    if (!dateString) return 'Recently updated'
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString))
}

function MetricCard({ label, value, description }: { label: string, value: string | number, description: string }) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">{value ?? '—'}</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  )
}

export function ProjectsClient({ projects = [] }: { projects: Project[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState('recent')
  const [viewFilter, setViewFilter] = useState('all')
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const normalizedProjects = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        tech: project.tech || [],
        badges: project.badges || [],
      })),
    [projects]
  )

  const featuredProjects = useMemo(
    () =>
      normalizedProjects
        .filter((project) => project.featured)
        .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99)),
    [normalizedProjects]
  )

  const regularProjects = useMemo(
    () => normalizedProjects.filter((project) => !project.featured),
    [normalizedProjects]
  )

  const productionProjects = useMemo(() => {
    return normalizedProjects
      .filter((project) => {
        if (!project.link?.href) return false
        const href = project.link.href.toLowerCase()
        return !href.includes('github.com')
      })
      .slice(0, 6)
  }, [normalizedProjects])

  const techCounts = useMemo(() => {
    const counts = new Map()

    normalizedProjects.forEach((project) => {
      project.tech.forEach((tech) => {
        if (!tech) return
        counts.set(tech, (counts.get(tech) || 0) + 1)
      })
    })

    return Array.from(counts.entries()).sort((a: any, b: any) => b[1] - a[1])
  }, [normalizedProjects])

  const topTechFilters = techCounts.slice(0, 8)

  const metrics = useMemo(() => {
    const totalProjects = normalizedProjects.length
    const openSourceProjects = normalizedProjects.filter(
      (project) => project.source === 'github' || Boolean(project.github)
    ).length
    const totalStars = normalizedProjects.reduce(
      (sum, project) => sum + (project.stats?.stars || 0),
      0
    )
    const latestUpdate = normalizedProjects
      .filter((project) => project.updatedAt)
      .sort(
        (a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
      )[0]

    return {
      totalProjects,
      openSourceProjects,
      totalStars,
      uniqueTech: techCounts.length,
      latestUpdate,
    }
  }, [normalizedProjects, techCounts])

  const filteredProjects = useMemo(() => {
    let collection = [...regularProjects]

    if (viewFilter === 'open-source') {
      collection = collection.filter(
        (project) => project.source === 'github' || Boolean(project.github)
      )
    }

    if (viewFilter === 'client') {
      collection = collection.filter((project) => project.source === 'custom')
    }

    if (selectedTech) {
      const target = selectedTech.toLowerCase()
      collection = collection.filter((project) =>
        project.tech.some((tech) => tech.toLowerCase() === target)
      )
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase()
      collection = collection.filter((project) => {
        const matchesName = project.name.toLowerCase().includes(query)
        const matchesDescription = project.description
          ?.toLowerCase()
          .includes(query)
        const matchesTech = project.tech.some((tech) =>
          tech.toLowerCase().includes(query)
        )
        const matchesBadges = project.badges?.some((badge) =>
          badge.toLowerCase().includes(query)
        )

        return matchesName || matchesDescription || matchesTech || matchesBadges
      })
    }

    return sortProjects(collection, sortOption)
  }, [regularProjects, viewFilter, selectedTech, searchTerm, sortOption])

  return (
    <>
      <SimpleLayout
        title="Projects that grow with me."
        intro="Every public repo, private deployment, and retained client build rolls onto this page automatically. Pick a stack, scan featured launches, or dive into the open-source work that shows how I ship from prototype to production."
      >
        <section className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Projects"
            value={metrics.totalProjects}
            description="Client + open source"
          />
          <MetricCard
            label="Open source"
            value={metrics.openSourceProjects}
            description={`${formatNumber(metrics.totalStars)} total stars`}
          />
          <MetricCard
            label="Tech stack"
            value={metrics.uniqueTech}
            description="Unique technologies"
          />
          <MetricCard
            label="Latest ship"
            value={
              metrics.latestUpdate?.updatedAt
                ? formatRelativeTime(metrics.latestUpdate.updatedAt)
                : '—'
            }
            description={metrics.latestUpdate?.name || 'Auto-updated from GitHub'}
          />
        </section>

        <section className="mb-10 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-4 w-4 text-zinc-400"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                className="block w-full rounded-lg border border-zinc-300 bg-zinc-50 py-3 pl-10 pr-4 text-sm text-zinc-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                placeholder="Search by name, stack, or problem space"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="inline-flex rounded-full border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
                {VIEW_FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setViewFilter(filter.value)}
                    className={clsx(
                      'rounded-full px-3 py-1 text-xs font-medium transition',
                      viewFilter === filter.value
                        ? 'bg-blue-600 text-white'
                        : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300'
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Popular stacks
            </p>
            {topTechFilters.map(([tech, count]: any) => (
              <button
                key={tech}
                onClick={() =>
                  setSelectedTech((current) => (current === tech ? null : tech))
                }
                className={clsx(
                  'rounded-full border px-3 py-1 text-xs font-medium transition',
                  selectedTech === tech
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'border-zinc-200 text-zinc-600 hover:border-blue-400 hover:text-blue-500 dark:border-zinc-700 dark:text-zinc-300'
                )}
              >
                {tech}
                <span className="ml-1 text-[0.65rem] text-zinc-400">×{count}</span>
              </button>
            ))}
            {selectedTech && (
              <button
                onClick={() => setSelectedTech(null)}
                className="text-xs font-medium text-blue-600 underline underline-offset-4"
              >
                Clear tech filter
              </button>
            )}
          </div>
        </section>

        {featuredProjects.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 text-xl font-bold text-zinc-800 dark:text-zinc-100">
              Featured case studies
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {featuredProjects.map((project) => (
                <div
                  key={project.name}
                  className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-50 via-white to-white p-6 shadow-lg dark:from-blue-900/20 dark:via-zinc-900 dark:to-zinc-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-blue-100 dark:bg-zinc-900">
                        <ProjectLogo logo={project.logo} name={project.name} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                          <Card.Link href={project.link.href}>{project.name}</Card.Link>
                        </h3>
                        <p className="text-sm text-blue-600 dark:text-blue-300">
                          {project.timeframe}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {project.badges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-white/70 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-white/50 dark:bg-zinc-800/60 dark:text-zinc-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-300">
                    <a
                      href={project.link.href}
                      className="inline-flex items-center gap-2 hover:text-blue-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkIcon className="h-5 w-5" />
                      {project.link.label}
                    </a>
                    {project.github && (
                      <a
                        href={project.github}
                        className="inline-flex items-center gap-2 hover:text-blue-600"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GitHubIcon className="h-5 w-5" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {productionProjects.length > 0 && (
          <section className="mb-16">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                Live production launches
              </h2>
              <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Auto-synced from GitHub + client updates
              </p>
            </div>
            <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
              {productionProjects.map((project) => (
                <div
                  key={`${project.name}-production`}
                  className="min-w-[260px] flex-1 rounded-2xl border border-zinc-100 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-blue-500 dark:text-blue-300">
                        {project.visibility === 'private' ? 'Private launch' : 'Public launch'}
                      </p>
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                        {project.name}
                      </h3>
                    </div>
                    <LinkIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {project.tech.slice(0, 3).map((tech) => (
                      <span key={tech} className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link.href}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit {project.link.label}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 6.75 17.25" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h9v9" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-4 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
          {searchTerm || selectedTech || viewFilter !== 'all' ? (
            <p>
              Showing {filteredProjects.length} project
              {filteredProjects.length !== 1 ? 's' : ''} that match your filters
            </p>
          ) : (
            <p>Showing all {filteredProjects.length} projects</p>
          )}
        </section>

        <ul
          role="list"
          className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project) => (
            <Card
              as="li"
              key={project.name}
              className="group border border-transparent transition hover:-translate-y-1 hover:border-zinc-200 hover:shadow-xl dark:hover:border-zinc-700"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800">
                <ProjectLogo logo={project.logo} name={project.name} />
              </div>
              <div className="mt-6 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-zinc-800 transition group-hover:text-blue-600 dark:text-zinc-100">
                    <Card.Link href={project.link.href}>{project.name}</Card.Link>
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{project.timeframe}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {project.badges?.slice(0, 1).map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full bg-zinc-100 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {badge}
                    </span>
                  ))}
                  {project.visibility === 'private' && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                      Private build
                    </span>
                  )}
                  {project.source === 'custom' && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                      Client work
                    </span>
                  )}
                </div>
              </div>
              <Card.Description>{project.description}</Card.Description>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-1">⭐ {project.stats?.stars ?? 0}</div>
                <div className="flex items-center gap-1">🍴 {project.stats?.forks ?? 0}</div>
                <div className="flex items-center gap-1">⏱ {formatMonthYear(project.updatedAt!)}</div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                <a
                  href={project.link.href}
                  className="inline-flex items-center gap-2 hover:text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkIcon className="h-5 w-5" />
                  {project.link.label}
                </a>
                {project.github && (
                  <a
                    href={project.github}
                    className="inline-flex items-center gap-2 hover:text-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitHubIcon className="h-5 w-5" />
                    GitHub
                  </a>
                )}
              </div>
            </Card>
          ))}
        </ul>

        {filteredProjects.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              No projects found. Try a different stack or reset your filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedTech(null)
                setViewFilter('all')
                setSortOption('recent')
              }}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white"
            >
              Reset filters
            </button>
          </div>
        )}

        <section className="mt-16">
          <h2 className="mb-4 text-lg font-semibold text-zinc-800 dark:text-zinc-100">
            Technologies I build with
          </h2>
          <div className="flex flex-wrap gap-2">
            {techCounts.slice(0, 20).map(([tech, count]: any) => (
              <span
                key={tech}
                className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
              >
                {tech}
                <span className="ml-1 text-[0.65rem] text-zinc-400">×{count}</span>
              </span>
            ))}
          </div>
        </section>
      </SimpleLayout>

      <button
        onClick={scrollToTop}
        className={`fixed right-8 bottom-8 rounded-full bg-blue-600 p-3 text-white shadow-lg transition-opacity ${
          showBackToTop ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-label="Back to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <div className="fixed bottom-4 right-4 z-50">
        <Link
          href="/projects"
          className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 px-3 py-2 text-white shadow-lg transition"
        >
          <div className="h-6 w-6 overflow-hidden rounded-full">
            <Image
              src="/ApplifyLogo.svg"
              alt="Applify AI Logo"
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <span className="text-xs font-medium">
            Built with Applify AI —{' '}
            <span className="underline decoration-dotted group-hover:no-underline">
              latest ship
            </span>
          </span>
        </Link>
      </div>
    </>
  )
}
