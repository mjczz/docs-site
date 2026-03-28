import { Link, useParams } from '@tanstack/react-router'
import { getProject } from '../lib/registry'

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams({ strict: false })
  const projectSlug = params.projectSlug ?? ''
  const project = getProject(projectSlug)

  if (!project) {
    return (
      <main className="main-content">
        <h1>Project not found</h1>
        <p style={{ color: 'var(--fg-muted)' }}>
          The project &ldquo;{projectSlug}&rdquo; does not exist.
        </p>
      </main>
    )
  }

  const coreTopics = project.topics.filter(t => t.category === 'core')
  const deepDiveTopics = project.topics.filter(t => t.category === 'deep-dive')
  const otherTopics = project.topics.filter(t => t.category === 'other')

  return (
    <div className="layout">
      <aside className="sidebar">
        <div style={{ marginBottom: '16px' }}>
          <Link to="/" className="sidebar-link" style={{ fontSize: '13px', color: 'var(--fg-muted)' }}>
            &larr; All Projects
          </Link>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div className="sidebar-section-title">{project.name}</div>
        </div>

        <Link
          to="/project/$projectSlug/"
          params={{ projectSlug: project.slug }}
          className="sidebar-link"
          activeOptions={{ exact: true }}
          style={{ fontWeight: 600 }}
        >
          Overview
        </Link>

        {coreTopics.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <div className="sidebar-section-title">Core Analysis</div>
            <nav>
              {coreTopics.map(topic => (
                <Link
                  key={topic.order}
                  to="/project/$projectSlug/topics/$slug"
                  params={{ projectSlug: project.slug, slug: topic.slug }}
                  className="sidebar-link"
                  activeProps={{ className: 'sidebar-link active' }}
                >
                  {topic.order}. {topic.title}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {deepDiveTopics.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <div className="sidebar-section-title">Deep Dives</div>
            <nav>
              {deepDiveTopics.map(topic => (
                <Link
                  key={topic.order}
                  to="/project/$projectSlug/deep-dives/$slug"
                  params={{ projectSlug: project.slug, slug: topic.slug }}
                  className="sidebar-link"
                  activeProps={{ className: 'sidebar-link active' }}
                >
                  {topic.title}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {otherTopics.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <div className="sidebar-section-title">Topics</div>
            <nav>
              {otherTopics.map(topic => (
                <Link
                  key={topic.order}
                  to="/project/$projectSlug/topics/$slug"
                  params={{ projectSlug: project.slug, slug: topic.slug }}
                  className="sidebar-link"
                  activeProps={{ className: 'sidebar-link active' }}
                >
                  {topic.title}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
