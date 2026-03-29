import { useEffect, useRef, useState, useCallback } from 'react'

export default function MermaidBlock({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [inlineScale, setInlineScale] = useState(1)
  const [overlayScale, setOverlayScale] = useState(1)
  const [svgDataUrl, setSvgDataUrl] = useState<string | null>(null)
  const inited = useRef(false)

  // Render mermaid
  useEffect(() => {
    let cancelled = false
    inited.current = false
    ;(async () => {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'loose' })
        if (cancelled || !ref.current) return
        const id = `m-${Math.random().toString(36).slice(2, 9)}`
        const { svg } = await mermaid.render(id, chart)
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
          const svgEl = ref.current.querySelector('svg')
          if (svgEl) {
            const vb = svgEl.getAttribute('viewBox')
            if (vb) {
              const parts = vb.split(/[\s,]+/)
              svgEl.dataset.ow = parts[2]
              svgEl.dataset.oh = parts[3]
            } else {
              const r = svgEl.getBoundingClientRect()
              svgEl.dataset.ow = String(r.width)
              svgEl.dataset.oh = String(r.height)
            }
            svgEl.style.maxWidth = 'none'
            inited.current = true
          }
          const blob = new Blob([svg], { type: 'image/svg+xml' })
          setSvgDataUrl(URL.createObjectURL(blob))
        }
      } catch (e) {
        if (!cancelled) setErrorMsg(e instanceof Error ? e.message : String(e))
      }
    })()
    return () => { cancelled = true }
  }, [chart])

  // Cleanup blob URL
  useEffect(() => {
    return () => { if (svgDataUrl) URL.revokeObjectURL(svgDataUrl) }
  }, [svgDataUrl])

  // Apply inline scale via SVG width/height
  useEffect(() => {
    if (!ref.current || !inited.current) return
    const svgEl = ref.current.querySelector('svg')
    if (!svgEl || !svgEl.dataset.ow) return
    const ow = parseFloat(svgEl.dataset.ow)
    const oh = parseFloat(svgEl.dataset.oh)
    svgEl.setAttribute('width', String(Math.round(ow * inlineScale)))
    svgEl.setAttribute('height', String(Math.round(oh * inlineScale)))
  }, [inlineScale])

  const zoomIn = useCallback(() => setInlineScale(s => Math.min(s + 0.25, 4)), [])
  const zoomOut = useCallback(() => setInlineScale(s => Math.max(s - 0.25, 0.5)), [])
  const zoomReset = useCallback(() => setInlineScale(1), [])

  const openFullscreen = useCallback(() => { setFullscreen(true); setOverlayScale(1) }, [])
  const closeFullscreen = useCallback(() => { setFullscreen(false); setOverlayScale(1) }, [])

  const onWheelOverlay = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setOverlayScale(s => {
      const next = s + (e.deltaY < 0 ? 0.2 : -0.2)
      return Math.min(Math.max(next, 0.5), 6)
    })
  }, [])

  // ESC to close overlay
  useEffect(() => {
    if (!fullscreen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeFullscreen() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [fullscreen, closeFullscreen])

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
    <>
      <div className="mermaid-outer">
        <div className="mermaid-toolbar" onClick={e => e.stopPropagation()}>
          <button onClick={zoomOut} title="缩小" aria-label="缩小">−</button>
          <span className="mermaid-zoom-label" onClick={zoomReset} title="重置缩放">
            {Math.round(inlineScale * 100)}%
          </span>
          <button onClick={zoomIn} title="放大" aria-label="放大">+</button>
          <button onClick={zoomReset} title="重置" aria-label="重置">⟲</button>
          <span className="mermaid-sep" />
          <button onClick={openFullscreen} title="全屏查看" aria-label="全屏查看">⤢</button>
        </div>
        <div className="mermaid-viewport" onClick={openFullscreen} title="点击全屏查看">
          <div ref={ref} className="mermaid-wrap" />
        </div>
      </div>

      {fullscreen && (
        <div className="mermaid-overlay" onClick={closeFullscreen}>
          <div className="mermaid-overlay-header">
            <button className="mermaid-close-btn" onClick={closeFullscreen} title="关闭 (ESC)" aria-label="关闭">✕</button>
            <span className="mermaid-overlay-info" onClick={e => { e.stopPropagation(); setOverlayScale(1) }}>
              {Math.round(overlayScale * 100)}%&nbsp;·&nbsp;滚轮缩放&nbsp;·&nbsp;点击百分比重置
            </span>
            <div style={{ width: 44 }} />
          </div>
          <div
            className="mermaid-overlay-body"
            onClick={e => e.stopPropagation()}
            onWheel={onWheelOverlay}
          >
            <img
              src={svgDataUrl || ''}
              alt="Mermaid diagram"
              className="mermaid-overlay-img"
              style={{ transform: `scale(${overlayScale})`, transformOrigin: 'center center' }}
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  )
}
