import { notFound } from 'next/navigation'
import { getArticle, getAllArticles } from '@/lib/getAllArticles'

export async function generateStaticParams() {
    const articles = await getAllArticles()
    return articles.map((article) => ({
        slug: article.slug,
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const article = await getArticle(slug)
    if (!article) return {}

    return {
        title: article.title,
        description: article.description,
    }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const article = await getArticle(slug)

    if (!article) {
        notFound()
    }

    const Component = article.component

    return (
        <Component />
    )
}
