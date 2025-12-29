/**
 * Text splitting utility for GSAP animations
 * Splits text into words/chars wrapped in spans for animation control
 */

export type SplitType = 'words' | 'chars' | 'lines'

export interface SplitResult {
  /** The resulting HTML string with wrapped elements */
  html: string
  /** Array of class names for targeting in GSAP */
  selector: string
}

/**
 * Split text content into animatable spans
 * @param text - The text to split
 * @param type - Split by 'words', 'chars', or 'lines'
 * @param prefix - CSS class prefix for targeting (default: 'split')
 */
export function splitText(
  text: string,
  type: SplitType = 'words',
  prefix = 'split'
): SplitResult {
  const className = `${prefix}-${type.slice(0, -1)}` // 'split-word', 'split-char', etc.

  if (type === 'chars') {
    const chars = text.split('')
    const html = chars
      .map((char, i) => {
        if (char === ' ') return ' '
        return `<span class="${className}" style="display:inline-block" data-index="${i}">${char}</span>`
      })
      .join('')
    return { html, selector: `.${className}` }
  }

  if (type === 'lines') {
    const lines = text.split('\n').filter(Boolean)
    const html = lines
      .map(
        (line, i) =>
          `<div class="${className}" style="display:block;overflow:hidden" data-index="${i}"><span style="display:block">${line}</span></div>`
      )
      .join('')
    return { html, selector: `.${className}` }
  }

  // Default: words
  const words = text.split(/\s+/).filter(Boolean)
  const html = words
    .map(
      (word, i) =>
        `<span class="${className}" style="display:inline-block" data-index="${i}">${word}</span>`
    )
    .join('<span style="display:inline-block;width:0.3em"></span>') // Word spacing

  return { html, selector: `.${className}` }
}

/**
 * Apply split text to a DOM element
 * Returns cleanup function to restore original content
 */
export function applySplitText(
  element: HTMLElement,
  type: SplitType = 'words',
  prefix = 'split'
): { elements: Element[]; restore: () => void } {
  const originalHTML = element.innerHTML
  const originalText = element.textContent || ''

  const { html, selector } = splitText(originalText, type, prefix)
  element.innerHTML = html

  const elements = Array.from(element.querySelectorAll(selector))

  return {
    elements,
    restore: () => {
      element.innerHTML = originalHTML
    },
  }
}

