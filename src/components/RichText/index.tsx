import React, { Fragment, ElementType } from 'react'
import escapeHTML from 'escape-html'
import Link from 'next/link'
import type {
  SerializedEditorState,
  SerializedLexicalNode,
  SerializedTextNode,
  SerializedElementNode,
} from '@payloadcms/richtext-lexical/lexical'

interface RichTextProps {
  content:
    | SerializedEditorState
    | { root?: { children?: SerializedLexicalNode[] } }
    | null
    | undefined
  className?: string
}

// Type‐guards
function isTextNode(node: SerializedLexicalNode): node is SerializedTextNode {
  return node.type === 'text'
}
function isElementNode(node: SerializedLexicalNode): node is SerializedElementNode {
  return Array.isArray((node as SerializedElementNode).children)
}
function isLinkNode(node: SerializedLexicalNode): node is SerializedLexicalNode & {
  type: 'link'
  fields: {
    linkType?: 'custom' | 'reference'
    url?: string
    newTab?: boolean
    doc?: { relationTo: string; value: string | { slug?: string } }
  }
} {
  return node.type === 'link'
}
function isHeadingNode(
  node: SerializedLexicalNode,
): node is SerializedLexicalNode & { type: 'heading'; tag: string } {
  return node.type === 'heading'
}
function isListNode(
  node: SerializedLexicalNode,
): node is SerializedLexicalNode & { type: 'list'; tag: string; listType?: string } {
  return node.type === 'list'
}
function isListItemNode(
  node: SerializedLexicalNode,
): node is SerializedLexicalNode & { type: 'listitem'; value?: number } {
  return node.type === 'listitem'
}

const serializeLexicalNodes = (nodes?: SerializedLexicalNode[]): React.ReactNode[] => {
  if (!nodes) return []

  return nodes.map((node, i) => {
    if (!node) return null

    // Text node formatting
    if (isTextNode(node)) {
      let elem: React.ReactNode = (
        <span key={`text-${i}`} dangerouslySetInnerHTML={{ __html: escapeHTML(node.text || '') }} />
      )
      const fmt = node.format ?? 0
      if (fmt & 1) elem = <strong key={`b-${i}`}>{elem}</strong>
      if (fmt & 2) elem = <em key={`i-${i}`}>{elem}</em>
      if (fmt & 4)
        elem = (
          <span key={`s-${i}`} style={{ textDecoration: 'line-through' }}>
            {elem}
          </span>
        )
      if (fmt & 8)
        elem = (
          <span key={`u-${i}`} style={{ textDecoration: 'underline' }}>
            {elem}
          </span>
        )

      if (fmt & 16) elem = <code key={`c-${i}`}>{elem}</code>
      if (fmt & 32) elem = <sub key={`sub-${i}`}>{elem}</sub>
      if (fmt & 64) elem = <sup key={`sup-${i}`}>{elem}</sup>
      return <Fragment key={i}>{elem}</Fragment>
    }

    // Element node children
    const children = isElementNode(node) ? serializeLexicalNodes(node.children) : []

    // Headings
    if (isHeadingNode(node)) {
      const Tag = (node.tag as ElementType) || 'p'
      return <Tag key={i}>{children}</Tag>
    }

    // Lists
    if (isListNode(node)) {
      const ListTag = (node.tag as ElementType) || 'ul'
      const className = node.listType ? `list-${node.listType}` : undefined
      return (
        <ListTag key={i} className={className}>
          {children}
        </ListTag>
      )
    }

    // List items
    if (isListItemNode(node)) {
      return (
        <li key={i} value={node.value}>
          {children}
        </li>
      )
    }

    // Links
    if (isLinkNode(node)) {
      const { linkType, url, doc, newTab } = node.fields || {}
      let href = '#'
      if (linkType === 'custom' && url) {
        href = url
      } else if (linkType === 'reference' && doc?.value) {
        const relation = doc.relationTo
        const slug = typeof doc.value === 'object' ? doc.value.slug : doc.value
        href = `/${relation}/${slug}`
      }
      return (
        <Link
          key={`link-${i}`}
          href={href}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
        >
          {children}
        </Link>
      )
    }

    // Paragraphs & line breaks
    if (node.type === 'paragraph') {
      return <p key={i}>{children}</p>
    }
    if (node.type === 'linebreak') {
      return <br key={i} />
    }

    // Fallback wrapper
    if (isElementNode(node)) {
      return <span key={i}>{children}</span>
    }

    return null
  })
}

const RichText: React.FC<RichTextProps> = ({ content, className }) => {
  const nodes = content?.root?.children ?? []
  if (nodes.length === 0) return null
  return <div className={className}>{serializeLexicalNodes(nodes)}</div>
}

export default RichText
