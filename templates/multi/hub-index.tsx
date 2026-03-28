import { Link, createFileRoute } from '@tanstack/react-router'
import { projects } from '../lib/registry'

export const Route = createFileRoute('/')({ component: HubHome })

function HubHome() {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.03em', color: 'var(--fg)' }}>
          __SITE_TITLE__
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--fg-muted)', margin: 0 }}>
          A collection of {projects.length} project analyses
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {projects.map((p) => (
          <Link
            key={p.slug}
            to="/project/$projectSlug/"
            params={{ projectSlug: p.slug }}
            className="card"
            style={{ display: 'block', padding: '20px', textDecoration: 'none' }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--fg)' }}>
              {p.name}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--fg-muted)', margin: '0 0 12px', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {p.description}
            </p>
            <div style={{ display: 'flex', gap: '8px', fontSize: '12px', flexWrap: 'wrap' }}>
              <span className="badge badge-accent">{p.topics.length} docs</span>
              {p.topics.filter(t => t.category === 'core').length > 0 && (
                <span className="badge badge-accent">{p.topics.filter(t => t.category === 'core').length} core</span>
              )}
              {p.topics.filter(t => t.category === 'deep-dive').length > 0 && (
                <span className="badge badge-success">{p.topics.filter(t => t.category === 'deep-dive').length} deep dives</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
