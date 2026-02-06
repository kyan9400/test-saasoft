<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import AccountRow from './AccountRow.vue'
import { useAccountsStore } from '@/stores/accounts.store'
import type { AccountRowModel, StoredAccount } from '@/types/accounts'
import { DEFAULT_ACCOUNT_TYPE } from '@/types/accounts'
import { parseTags, tagsToInput } from '@/utils/tags'
import { validateRow, hasErrors } from '@/utils/validate'

/**
 * Pinia store
 */
const store = useAccountsStore()

/**
 * UI-модели строк (локальное состояние)
 */
const rows = ref<AccountRowModel[]>([])

/**
 * Состояние видимости пароля для каждой строки
 */
const passwordVisibility = ref<Record<string, boolean>>({})

/**
 * Генерация уникального ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Преобразует StoredAccount в AccountRowModel
 */
function storedToRowModel(stored: StoredAccount): AccountRowModel {
  return {
    id: stored.id,
    tagsInput: tagsToInput(stored.tags),
    type: stored.type,
    login: stored.login,
    password: stored.password ?? '',
    errors: {}
  }
}

/**
 * Преобразует AccountRowModel в StoredAccount
 */
function rowModelToStored(row: AccountRowModel): StoredAccount {
  return {
    id: row.id,
    tags: parseTags(row.tagsInput),
    type: row.type,
    login: row.login.trim(),
    password: row.type === 'Локальная' ? row.password.trim() : null
  }
}

/**
 * Загрузка данных при монтировании
 */
onMounted(() => {
  store.loadFromStorage()
  
  // Преобразуем данные из store в UI-модели
  rows.value = store.accounts.map(storedToRowModel)
  
  // Инициализируем видимость паролей
  rows.value.forEach(row => {
    passwordVisibility.value[row.id] = false
  })
})

/**
 * Добавление новой пустой записи
 */
function addEmptyRow() {
  const newId = generateId()
  
  const newRow: AccountRowModel = {
    id: newId,
    tagsInput: '',
    type: DEFAULT_ACCOUNT_TYPE,
    login: '',
    password: '',
    errors: {}
  }
  
  rows.value.push(newRow)
  passwordVisibility.value[newId] = false
}

/**
 * Удаление записи
 */
function removeRow(id: string) {
  const index = rows.value.findIndex(r => r.id === id)
  
  if (index !== -1) {
    rows.value.splice(index, 1)
    delete passwordVisibility.value[id]
    
    // Удаляем из store если там есть
    if (store.hasAccount(id)) {
      store.removeAccount(id)
    }
  }
}

/**
 * Обновление строки
 */
function updateRow(index: number, updatedRow: AccountRowModel) {
  rows.value[index] = updatedRow
}

/**
 * Обновление видимости пароля
 */
function updatePasswordVisibility(id: string, visible: boolean) {
  passwordVisibility.value[id] = visible
}

/**
 * Валидация и сохранение при blur
 */
function handleBlur(index: number, field: 'tags' | 'login' | 'password') {
  const row = rows.value[index]
  
  // Валидируем строку
  const errors = validateRow(row)
  rows.value[index] = { ...row, errors }
  
  // Если валидно - сохраняем в store
  if (!hasErrors(errors)) {
    const stored = rowModelToStored(row)
    store.upsertAccount(stored)
  }
}

/**
 * Обработка смены типа записи
 */
function handleTypeChange(index: number) {
  const row = rows.value[index]
  
  // Если тип сменился на LDAP - очищаем пароль и убираем ошибку
  if (row.type === 'LDAP') {
    rows.value[index] = {
      ...row,
      password: '',
      errors: { ...row.errors, password: false }
    }
  }
  
  // Валидируем и сохраняем
  const errors = validateRow(rows.value[index])
  rows.value[index] = { ...rows.value[index], errors }
  
  if (!hasErrors(errors)) {
    const stored = rowModelToStored(rows.value[index])
    store.upsertAccount(stored)
  }
}

/**
 * Обработка удаления
 */
function handleDelete(id: string) {
  removeRow(id)
}

/**
 * Expose для родителя
 */
defineExpose({
  addEmptyRow
})
</script>

<template>
  <div class="accounts-list">
    <!-- Заголовки колонок -->
    <div class="list-header">
      <div class="header-cell header-tags">Метки</div>
      <div class="header-cell header-type">Тип записи</div>
      <div class="header-cell header-login">Логин</div>
      <div class="header-cell header-password">Пароль</div>
      <div class="header-cell header-delete"></div>
    </div>

    <!-- Список записей -->
    <div class="list-body">
      <AccountRow
        v-for="(row, index) in rows"
        :key="row.id"
        :row="row"
        :show-password="passwordVisibility[row.id] ?? false"
        @update:row="(updated) => updateRow(index, updated)"
        @update:show-password="(visible) => updatePasswordVisibility(row.id, visible)"
        @blur="(field) => handleBlur(index, field)"
        @type-change="handleTypeChange(index)"
        @delete="handleDelete(row.id)"
      />
    </div>

    <!-- Пустое состояние -->
    <div v-if="rows.length === 0" class="empty-state">
      <p>Нет учетных записей. Нажмите "+" чтобы добавить.</p>
    </div>
  </div>
</template>

<style scoped>
.accounts-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.list-header {
  display: grid;
  grid-template-columns: 1fr 150px 1fr 1fr 50px;
  gap: 12px;
  padding: 16px 16px 12px;
  background: #fafafa;
  border-bottom: 1px solid #ebeef5;
}

.header-cell {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.list-body {
  padding: 0 16px;
}

.empty-state {
  padding: 48px 16px;
  text-align: center;
  color: #909399;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}
</style>

