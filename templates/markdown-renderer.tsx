import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import MermaidBlock from './MermaidBlock'

function extractText(node: React.ReactNode): string {
  if (node == null) return ''
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (typeof node === 'object' && 'props' in (node as React.ReactElement)) {
    return extractText((node as React.ReactElement).props.children)
  }
  return ''
}

function CodeBlock({
  className,
  children,
  ...rest
}: React.ComponentProps<'code'> & { node?: unknown }) {
  const lang = className?.match(/language-(\w+)/)?.[1]
  const value = extractText(children).replace(/\n$/, '')

  if (lang === 'mermaid') {
    return <MermaidBlock chart={value} />
  }

  return (
    <code className={className} {...rest}>
      {children}
    </code>
  )
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code: CodeBlock as React.ComponentType<
            React.ComponentProps<'code'> & { node?: unknown }
          >,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
