import { createFileRoute } from '@tanstack/react-router'
import { getTopicBySlug, coreTopics } from '../../lib/topics'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import { useTopicContent } from '../../hooks/useTopicContent'

export const Route = createFileRoute('/topics/$slug')({
  loader: ({ params }) => {
    const topic = getTopicBySlug(params.slug)
    if (!topic) throw new Error('Not found')
    return { topic }
  },
  component: TopicPage,
})

function TopicPage() {
  const { topic } = Route.useLoaderData()
  const { content, loading, error } = useTopicContent(topic.url)
  const idx = coreTopics.findIndex((t) => t.slug === topic.slug)
  const prev = idx > 0 ? coreTopics[idx - 1] : null
  const next = idx < coreTopics.length - 1 ? coreTopics[idx + 1] : null

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '8px', fontSize: '13px', color: 'var(--fg-muted)' }}>
        Core Analysis &middot; {topic.order} / {coreTopics.length}
      </div>
      {loading && (
        <div className="prose" style={{ color: 'var(--fg-muted)', padding: '24px 0' }}>
          Loading content...
        </div>
      )}
      {error && (
        <div className="prose" style={{ color: 'var(--accent)', padding: '24px 0' }}>
          Failed to load content: {error}
        </div>
      )}
      {!loading && !error && <MarkdownRenderer content={content} />}
      <nav className="page-nav">
        {prev ? (
          <a href={`/topics/${prev.slug}`}>&larr; {prev.title}</a>
        ) : <span />}
        {next ? (
          <a href={`/topics/${next.slug}`}>{next.title} &rarr;</a>
        ) : <span />}
      </nav>
    </div>
  )
}
