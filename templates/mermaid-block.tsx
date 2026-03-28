import { useEffect, useRef, useState } from 'react'

export default function MermaidBlock({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'loose' })
        if (cancelled || !ref.current) return
        const id = `m-${Math.random().toString(36).slice(2, 9)}`
        const { svg } = await mermaid.render(id, chart)
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
        }
      } catch {
        if (!cancelled) setError(true)
      }
    })()
    return () => { cancelled = true }
  }, [chart])

  if (error) {
    return (
      <div className="mermaid-wrap">
        <pre><code>{chart}</code></pre>
      </div>
    )
  }

  return <div ref={ref} className="mermaid-wrap" />
}
