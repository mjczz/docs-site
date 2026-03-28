import topic01 from '../../../topics/01-project-basic-info.md?raw'
import topic02 from '../../../topics/02-project-structure.md?raw'
import topic03 from '../../../topics/03-tech-stack.md?raw'
import topic04 from '../../../topics/04-core-features.md?raw'
import topic05 from '../../../topics/05-architecture-design.md?raw'
import topic06 from '../../../topics/06-code-quality.md?raw'
import topic07 from '../../../topics/07-documentation-quality.md?raw'
import topic08 from '../../../topics/08-project-activity.md?raw'
import topic09 from '../../../topics/09-strengths-weaknesses.md?raw'
import topic10 from '../../../topics/10-use-cases.md?raw'
import topic11 from '../../../topics/11-learning-value.md?raw'
import topic12 from '../../../topics/12-summary.md?raw'
import dd01 from '../../../topics/deep-dive-01-gateway-protocol.md?raw'
import dd02 from '../../../topics/deep-dive-02-auto-reply-pipeline.md?raw'
import dd03 from '../../../topics/deep-dive-03-session-jsonl-storage.md?raw'
import dd04 from '../../../topics/deep-dive-04-tool-policy.md?raw'
import dd05 from '../../../topics/deep-dive-05-plugin-jiti-loading.md?raw'

export interface TopicMeta {
  slug: string
  title: string
  category: 'core' | 'deep-dive'
  order: number
  content: string
}

function extractTitle(md: string): string {
  const m = md.match(/^#\s+(.+)$/m)
  return m ? m[1].replace(/\s*[-–—]\s*OpenClaw\s*$/i, '').trim() : 'Untitled'
}

const all: TopicMeta[] = [
  { slug: '01-project-basic-info', category: 'core', order: 1, content: topic01 },
  { slug: '02-project-structure', category: 'core', order: 2, content: topic02 },
  { slug: '03-tech-stack', category: 'core', order: 3, content: topic03 },
  { slug: '04-core-features', category: 'core', order: 4, content: topic04 },
  { slug: '05-architecture-design', category: 'core', order: 5, content: topic05 },
  { slug: '06-code-quality', category: 'core', order: 6, content: topic06 },
  { slug: '07-documentation-quality', category: 'core', order: 7, content: topic07 },
  { slug: '08-project-activity', category: 'core', order: 8, content: topic08 },
  { slug: '09-strengths-weaknesses', category: 'core', order: 9, content: topic09 },
  { slug: '10-use-cases', category: 'core', order: 10, content: topic10 },
  { slug: '11-learning-value', category: 'core', order: 11, content: topic11 },
  { slug: '12-summary', category: 'core', order: 12, content: topic12 },
  { slug: 'deep-dive-01-gateway-protocol', category: 'deep-dive', order: 1, content: dd01 },
  { slug: 'deep-dive-02-auto-reply-pipeline', category: 'deep-dive', order: 2, content: dd02 },
  { slug: 'deep-dive-03-session-jsonl-storage', category: 'deep-dive', order: 3, content: dd03 },
  { slug: 'deep-dive-04-tool-policy', category: 'deep-dive', order: 4, content: dd04 },
  { slug: 'deep-dive-05-plugin-jiti-loading', category: 'deep-dive', order: 5, content: dd05 },
].map((t) => ({ ...t, title: extractTitle(t.content) }))

export const coreTopics = all.filter((t) => t.category === 'core')
export const deepDiveTopics = all.filter((t) => t.category === 'deep-dive')
export const topics = all

export function getTopicBySlug(slug: string): TopicMeta | undefined {
  return all.find((t) => t.slug === slug)
}
