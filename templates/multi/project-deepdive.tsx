import { createFileRoute, Link } from '@tanstack/react-router'
import { getProject, getTopic } from '../../../../lib/registry'
import MarkdownRenderer from '../../../../components/MarkdownRenderer'
import ProjectLayout from '../../../../components/ProjectLayout'
import { useTopicContent } from '../../../../hooks/useTopicContent'

export const Route = createFileRoute('/project/$projectSlug/deep-dives/$slug')({
  component: DeepDivePage,
})

function DeepDivePage() {
  const { projectSlug, slug } = Route.useParams()
  const project = getProject(projectSlug)
  const topic = getTopic(projectSlug, slug)
  const { content, loading, error } = useTopicContent(topic?.url)

  if (!project || !topic) {
    return (
      <ProjectLayout>
        <div className="fade-in">
          <h1>Deep dive not found</h1>
          <Link to="/project/$projectSlug/" params={{ projectSlug }} style={{ color: 'var(--accent)' }}>
            Back to {project?.name ?? projectSlug}
          </Link>
        </div>
      </ProjectLayout>
    )
  }

  const deepDives = project.deepDiveTopics
  const currentIndex = deepDives.findIndex(t => t.slug === slug)
  const prev = currentIndex > 0 ? deepDives[currentIndex - 1] : null
  const next = currentIndex < deepDives.length - 1 ? deepDives[currentIndex + 1] : null

  return (
    <ProjectLayout>
      <div className="fade-in">
        <div style={{ marginBottom: '8px', fontSize: '13px', color: 'var(--fg-muted)' }}>
          <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Home</Link>
          {' / '}
          <Link to="/project/$projectSlug/" params={{ projectSlug }} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            {project.name}
          </Link>
          {' / '}
          {topic.title}
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
            <Link to="/project/$projectSlug/deep-dives/$slug" params={{ projectSlug, slug: prev.slug }} style={{ textDecoration: 'none' }}>
              &larr; {prev.title}
            </Link>
          ) : <span />}
          {next ? (
            <Link to="/project/$projectSlug/deep-dives/$slug" params={{ projectSlug, slug: next.slug }} style={{ textDecoration: 'none' }}>
              {next.title} &rarr;
            </Link>
          ) : <span />}
        </nav>
      </div>
    </ProjectLayout>
  )
}
