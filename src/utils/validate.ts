import type { AccountRowModel, AccountRowErrors } from '@/types/accounts'

/**
 * Максимальная длина поля меток
 */
export const MAX_TAGS_LENGTH = 50

/**
 * Максимальная длина логина и пароля
 */
export const MAX_LOGIN_LENGTH = 100
export const MAX_PASSWORD_LENGTH = 100

/**
 * Валидирует поле меток
 * @param tagsInput - строка ввода меток
 * @returns true если есть ошибка, false если валидно
 */
export function validateTagsField(tagsInput: string): boolean {
  // Метки необязательны, но если заполнены - максимум 50 символов
  if (tagsInput && tagsInput.length > MAX_TAGS_LENGTH) {
    return true // ошибка
  }
  return false
}

/**
 * Валидирует поле логина
 * @param login - значение логина
 * @returns true если есть ошибка, false если валидно
 */
export function validateLoginField(login: string): boolean {
  const trimmed = login.trim()
  // Логин обязателен и не должен превышать 100 символов
  if (!trimmed || trimmed.length === 0) {
    return true // ошибка: пустой
  }
  if (trimmed.length > MAX_LOGIN_LENGTH) {
    return true // ошибка: слишком длинный
  }
  return false
}

/**
 * Валидирует поле пароля
 * @param password - значение пароля
 * @param isLocalType - true если тип "Локальная"
 * @returns true если есть ошибка, false если валидно
 */
export function validatePasswordField(password: string, isLocalType: boolean): boolean {
  // Для LDAP пароль не требуется
  if (!isLocalType) {
    return false
  }

  const trimmed = password.trim()
  // Для Локальной записи пароль обязателен
  if (!trimmed || trimmed.length === 0) {
    return true // ошибка: пустой
  }
  if (trimmed.length > MAX_PASSWORD_LENGTH) {
    return true // ошибка: слишком длинный
  }
  return false
}

/**
 * Валидирует всю строку и возвращает объект ошибок
 * @param row - модель строки UI
 * @returns объект с флагами ошибок
 */
export function validateRow(row: AccountRowModel): AccountRowErrors {
  const isLocalType = row.type === 'Локальная'

  return {
    tags: validateTagsField(row.tagsInput),
    login: validateLoginField(row.login),
    password: validatePasswordField(row.password, isLocalType)
  }
}

/**
 * Проверяет, есть ли ошибки в объекте ошибок
 * @param errors - объект ошибок
 * @returns true если есть хотя бы одна ошибка
 */
export function hasErrors(errors: AccountRowErrors): boolean {
  return Boolean(errors.tags || errors.login || errors.password)
}

/**
 * Проверяет, валидна ли строка для сохранения в store
 * @param row - модель строки UI
 * @returns true если строка валидна для сохранения
 */
export function isRowValidForStore(row: AccountRowModel): boolean {
  const errors = validateRow(row)
  return !hasErrors(errors)
}

