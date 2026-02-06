import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StoredAccount } from '@/types/accounts'

/**
 * Ключ для хранения в localStorage
 */
const STORAGE_KEY = 'accounts_store_v1'

/**
 * Pinia store для управления учетными записями
 */
export const useAccountsStore = defineStore('accounts', () => {
  /**
   * Список валидных учетных записей
   */
  const accounts = ref<StoredAccount[]>([])

  /**
   * Загружает данные из localStorage
   */
  function loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          accounts.value = parsed
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки из localStorage:', error)
      accounts.value = []
    }
  }

  /**
   * Сохраняет данные в localStorage
   */
  function persistToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts.value))
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error)
    }
  }

  /**
   * Добавляет или обновляет учетную запись
   * @param account - учетная запись для upsert
   */
  function upsertAccount(account: StoredAccount): void {
    const index = accounts.value.findIndex(a => a.id === account.id)
    
    if (index !== -1) {
      // Обновляем существующую
      accounts.value[index] = { ...account }
    } else {
      // Добавляем новую
      accounts.value.push({ ...account })
    }
    
    persistToStorage()
  }

  /**
   * Удаляет учетную запись по id
   * @param id - идентификатор записи
   */
  function removeAccount(id: string): void {
    const index = accounts.value.findIndex(a => a.id === id)
    
    if (index !== -1) {
      accounts.value.splice(index, 1)
      persistToStorage()
    }
  }

  /**
   * Проверяет, существует ли запись с данным id в store
   * @param id - идентификатор записи
   */
  function hasAccount(id: string): boolean {
    return accounts.value.some(a => a.id === id)
  }

  return {
    accounts,
    loadFromStorage,
    persistToStorage,
    upsertAccount,
    removeAccount,
    hasAccount
  }
})

