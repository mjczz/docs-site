import { useEffect, useRef, useState, useCallback } from 'react'

export default function MermaidBlock({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })

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
      } catch (e) {
        if (!cancelled) setErrorMsg(e instanceof Error ? e.message : String(e))
      }
    })()
    return () => { cancelled = true }
  }, [chart])

  // Reset pan when scale changes back to 1
  useEffect(() => {
    if (scale === 1) setPan({ x: 0, y: 0 })
  }, [scale])

  const zoomIn = useCallback(() => setScale(s => Math.min(s + 0.25, 4)), [])
  const zoomOut = useCallback(() => setScale(s => Math.max(s - 0.25, 0.5)), [])
  const zoomReset = useCallback(() => { setScale(1); setPan({ x: 0, y: 0 }) }, [])

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setScale(s => {
      const next = s + (e.deltaY < 0 ? 0.15 : -0.15)
      return Math.min(Math.max(next, 0.5), 4)
    })
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (scale <= 1) return
    dragging.current = true
    last.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [scale])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    setPan(p => ({
      x: p.x + e.clientX - last.current.x,
      y: p.y + e.clientY - last.current.y,
    }))
    last.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onPointerUp = useCallback(() => { dragging.current = false }, [])

  if (errorMsg) {
    return (
      <div className="mermaid-wrap" style={{ border: '1px dashed var(--fg-muted)', padding: '12px', borderRadius: '6px' }}>
        <div style={{ color: 'var(--accent)', fontSize: '13px', marginBottom: '8px' }}>
          Mermaid render failed: {errorMsg}
        </div>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}><code>{chart}</code></pre>
      </div>
    )
  }

  return (
    <div className="mermaid-outer">
      <div className="mermaid-toolbar">
        <button onClick={zoomOut} title="缩小" aria-label="缩小">−</button>
        <span className="mermaid-zoom-label" onClick={zoomReset} title="重置缩放">
          {Math.round(scale * 100)}%
        </span>
        <button onClick={zoomIn} title="放大" aria-label="放大">+</button>
        <button onClick={zoomReset} title="重置" aria-label="重置">⟲</button>
      </div>
      <div
        className="mermaid-viewport"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          ref={ref}
          className="mermaid-wrap"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center top',
            cursor: scale > 1 ? (dragging.current ? 'grabbing' : 'grab') : 'default',
          }}
        />
      </div>
    </div>
  )
}
