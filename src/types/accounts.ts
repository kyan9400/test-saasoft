/**
 * Типы учетных записей
 */
export type AccountType = 'LDAP' | 'Локальная'

/**
 * Тег (метка) учетной записи
 */
export interface Tag {
  text: string
}

/**
 * Хранимая учетная запись (для Pinia store и localStorage)
 */
export interface StoredAccount {
  id: string
  tags: Tag[]
  type: AccountType
  login: string
  password: string | null
}

/**
 * Модель строки UI для формы редактирования
 */
export interface AccountRowModel {
  id: string
  tagsInput: string        // строка ввода меток через ';'
  type: AccountType
  login: string
  password: string         // в UI всегда строка, но при LDAP скрыта
  errors: AccountRowErrors
}

/**
 * Ошибки валидации для строки
 */
export interface AccountRowErrors {
  tags?: boolean
  login?: boolean
  password?: boolean
}

/**
 * Дефолтные значения
 */
export const DEFAULT_ACCOUNT_TYPE: AccountType = 'Локальная'

export const ACCOUNT_TYPE_OPTIONS: AccountType[] = ['Локальная', 'LDAP']

