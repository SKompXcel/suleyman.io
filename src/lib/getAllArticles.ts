import glob from 'fast-glob'
import * as path from 'path'

export interface ArticleMeta {
  title: string
  description: string
  date: string
  slug: string
  component: any // The MDX component
  isRssFeed?: boolean
}

async function importArticle(articleFilename: string): Promise<ArticleMeta> {
  // Relative to src/lib
  let { meta, default: component } = await import(
    `../content/articles/${articleFilename}`
  )
  return {
    slug: articleFilename.replace(/(\/index)?\.mdx$/, ''),
    ...meta,
    component,
  }
}

export async function getAllArticles(): Promise<ArticleMeta[]> {
  let articleFilenames = await glob(['*.mdx', '*/index.mdx'], {
    cwd: path.join(process.cwd(), 'src/content/articles'),
  })

  let articles = await Promise.all(articleFilenames.map(importArticle))

  return articles.sort((a, z) => new Date(z.date).getTime() - new Date(a.date).getTime())
}

export async function getArticle(slug: string): Promise<ArticleMeta | null> {
    const allArticles = await getAllArticles()
    return allArticles.find((article) => article.slug === slug) || null
}
