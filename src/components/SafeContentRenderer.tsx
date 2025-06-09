'use client';

import React from 'react';
import { sanitizeHtml } from '@/lib/utils/security';

interface SafeContentRendererProps {
  content: string;
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
  maxLength?: number;
}

/**
 * SafeContentRenderer - Renders HTML content safely by sanitizing it
 * This component prevents XSS attacks by using DOMPurify to clean HTML
 */
export default function SafeContentRenderer({
  content,
  className = '',
  allowedTags,
  allowedAttributes,
  maxLength = 10000
}: SafeContentRendererProps) {
  // Truncate content if it exceeds maxLength
  const truncatedContent = content.length > maxLength 
    ? content.substring(0, maxLength) + '...'
    : content;

  // Sanitize the HTML content
  const sanitizedContent = sanitizeHtml(truncatedContent, {
    ALLOWED_TAGS: allowedTags || [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: allowedAttributes || [
      'href', 'target', 'rel', 'src', 'alt', 'title', 'class'
    ],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover']
  });

  return (
    <div 
      className={`safe-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}

/**
 * TextOnlyRenderer - Renders content as plain text (no HTML)
 */
export function TextOnlyRenderer({ 
  content, 
  className = '',
  maxLength = 1000 
}: {
  content: string;
  className?: string;
  maxLength?: number;
}) {
  const truncatedContent = content.length > maxLength 
    ? content.substring(0, maxLength) + '...'
    : content;

  return (
    <div className={className}>
      {truncatedContent}
    </div>
  );
}

/**
 * MarkdownRenderer - Safely renders markdown content
 */
export function MarkdownRenderer({ 
  content, 
  className = '' 
}: {
  content: string;
  className?: string;
}) {
  // Simple markdown to HTML conversion (basic support)
  const htmlContent = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  return (
    <SafeContentRenderer 
      content={htmlContent} 
      className={className}
      allowedTags={['p', 'br', 'strong', 'em', 'a']}
      allowedAttributes={['href', 'target', 'rel']}
    />
  );
}