import { createFileRoute, Link } from '@tanstack/react-router'
import { getProject } from '../../../lib/registry'
import ProjectLayout from '../../../components/ProjectLayout'

export const Route = createFileRoute('/project/$projectSlug/')({
  component: ProjectIndex,
})

function ProjectIndex() {
  const { projectSlug } = Route.useParams()
  const project = getProject(projectSlug)

  if (!project) return null

  const coreTopics = project.topics.filter(t => t.category === 'core')
  const deepDiveTopics = project.topics.filter(t => t.category === 'deep-dive')
  const otherTopics = project.topics.filter(t => t.category === 'other')

  return (
    <ProjectLayout>
      <div className="fade-in">
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em', color: 'var(--fg)' }}>
            {project.name}
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--fg-muted)', margin: 0, maxWidth: '600px' }}>
            {project.description}
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '14px', flexWrap: 'wrap' }}>
            <span className="badge badge-accent">{project.topics.length} Documents</span>
            {deepDiveTopics.length > 0 && (
              <span className="badge badge-success">{deepDiveTopics.length} Deep Dives</span>
            )}
          </div>
        </div>

        {coreTopics.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              Core Analysis
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
              {coreTopics.map(topic => (
                <Link
                  key={topic.order}
                  to="/project/$projectSlug/topics/$slug"
                  params={{ projectSlug: project.slug, slug: topic.slug }}
                  className="card"
                  style={{ display: 'block', padding: '12px 16px', textDecoration: 'none' }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', marginBottom: '4px' }}>
                    {String(topic.order).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--fg)' }}>
                    {topic.title}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {deepDiveTopics.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              Deep Dives
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
              {deepDiveTopics.map(topic => (
                <Link
                  key={topic.order}
                  to="/project/$projectSlug/deep-dives/$slug"
                  params={{ projectSlug: project.slug, slug: topic.slug }}
                  className="card"
                  style={{ display: 'block', padding: '12px 16px', textDecoration: 'none' }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--success)', marginBottom: '4px' }}>
                    Deep Dive
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--fg)' }}>
                    {topic.title}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {otherTopics.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              All Topics
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
              {otherTopics.map(topic => (
                <Link
                  key={topic.order}
                  to="/project/$projectSlug/topics/$slug"
                  params={{ projectSlug: project.slug, slug: topic.slug }}
                  className="card"
                  style={{ display: 'block', padding: '12px 16px', textDecoration: 'none' }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--fg)' }}>
                    {topic.title}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </ProjectLayout>
  )
}
