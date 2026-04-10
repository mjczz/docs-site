import { createFileRoute } from '@tanstack/react-router'
import { getTopicBySlug, deepDiveTopics } from '../../lib/topics'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import { useTopicContent } from '../../hooks/useTopicContent'

export const Route = createFileRoute('/deep-dives/$slug')({
  loader: ({ params }) => {
    const topic = getTopicBySlug(params.slug)
    if (!topic) throw new Error('Not found')
    return { topic }
  },
  component: DeepDivePage,
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData.topic.title} - Analysis` }],
  }),
})

function DeepDivePage() {
  const { topic } = Route.useLoaderData()
  const { content, loading, error } = useTopicContent(topic.url)
  const idx = deepDiveTopics.findIndex((t) => t.slug === topic.slug)
  const prev = idx > 0 ? deepDiveTopics[idx - 1] : null
  const next = idx < deepDiveTopics.length - 1 ? deepDiveTopics[idx + 1] : null

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '8px', fontSize: '13px', color: 'var(--fg-muted)' }}>
        Deep Dive &middot; {topic.order} / {deepDiveTopics.length}
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
          <a href={`/deep-dives/${prev.slug}`}>&larr; {prev.title}</a>
        ) : <span />}
        {next ? (
          <a href={`/deep-dives/${next.slug}`}>{next.title} &rarr;</a>
        ) : <span />}
      </nav>
    </div>
  )
}
