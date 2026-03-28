import { createFileRoute } from '@tanstack/react-router'
import { getTopicBySlug, deepDiveTopics } from '../../lib/topics'
import MarkdownRenderer from '../../components/MarkdownRenderer'

export const Route = createFileRoute('/deep-dives/$slug')({
  loader: ({ params }) => {
    const topic = getTopicBySlug(params.slug)
    if (!topic) throw new Error('Not found')
    return { topic }
  },
  component: DeepDivePage,
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData.topic.title} - OpenClaw Analysis` }],
  }),
})

function DeepDivePage() {
  const { topic } = Route.useLoaderData()
  const idx = deepDiveTopics.findIndex((t) => t.slug === topic.slug)
  const prev = idx > 0 ? deepDiveTopics[idx - 1] : null
  const next = idx < deepDiveTopics.length - 1 ? deepDiveTopics[idx + 1] : null

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '8px', fontSize: '13px', color: 'var(--fg-muted)' }}>
        Deep Dive &middot; {topic.order} / {deepDiveTopics.length}
      </div>
      <MarkdownRenderer content={topic.content} />
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
