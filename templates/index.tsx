import { Link, createFileRoute } from '@tanstack/react-router'
import { coreTopics, deepDiveTopics } from '../lib/topics'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <div className="fade-in">
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          OpenClaw
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--fg-muted)', margin: 0, maxWidth: '600px' }}>
          A comprehensive analysis of OpenClaw — a multi-channel AI gateway with 12 core topics and 5 deep-dive investigations.
        </p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '14px' }}>
          <span className="badge badge-accent">{coreTopics.length} Core Topics</span>
          <span className="badge badge-success">{deepDiveTopics.length} Deep Dives</span>
        </div>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
          Core Analysis
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
          {coreTopics.map((t) => (
            <Link
              key={t.order}
              to="/topics/$slug"
              params={{ slug: t.slug }}
              className="card"
              style={{ display: 'block', padding: '12px 16px', textDecoration: 'none' }}
            >
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', marginBottom: '4px' }}>
                {String(t.order).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--fg)' }}>
                {t.title}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
          Deep Dives
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
          {deepDiveTopics.map((t) => (
            <Link
              key={t.order}
              to="/deep-dives/$slug"
              params={{ slug: t.slug }}
              className="card"
              style={{ display: 'block', padding: '12px 16px', textDecoration: 'none' }}
            >
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--success)', marginBottom: '4px' }}>
                Deep Dive {t.order}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--fg)' }}>
                {t.title}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
