import type { Tag } from '@/types/accounts'

/**
 * Парсит строку меток, разделенных ';', в массив объектов Tag
 * @param input - строка вида "tag1; tag2; tag3"
 * @returns массив тегов [{ text: "tag1" }, { text: "tag2" }, ...]
 */
export function parseTags(input: string): Tag[] {
  if (!input || !input.trim()) {
    return []
  }

  return input
    .split(';')
    .map(part => part.trim())
    .filter(part => part.length > 0)
    .map(text => ({ text }))
}

/**
 * Конвертирует массив тегов обратно в строку для отображения в input
 * @param tags - массив тегов
 * @returns строка вида "tag1; tag2; tag3"
 */
export function tagsToInput(tags: Tag[]): string {
  if (!tags || tags.length === 0) {
    return ''
  }

  return tags.map(tag => tag.text).join('; ')
}

