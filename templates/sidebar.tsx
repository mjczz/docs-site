import { Link, useRouterState } from '@tanstack/react-router'
import { coreTopics, deepDiveTopics } from '../lib/topics'

export default function Sidebar() {
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '24px' }}>
        <div className="sidebar-section-title">Core Analysis</div>
        <nav>
          {coreTopics.map((t) => (
            <Link
              key={t.order}
              to="/topics/$slug"
              params={{ slug: t.slug }}
              className={`sidebar-link ${currentPath === `/topics/${t.slug}` ? 'active' : ''}`}
            >
              {t.order}. {t.title}
            </Link>
          ))}
        </nav>
      </div>
      <div>
        <div className="sidebar-section-title">Deep Dives</div>
        <nav>
          {deepDiveTopics.map((t) => (
            <Link
              key={t.order}
              to="/deep-dives/$slug"
              params={{ slug: t.slug }}
              className={`sidebar-link ${currentPath === `/deep-dives/${t.slug}` ? 'active' : ''}`}
            >
              {t.title}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
