<script setup lang="ts">
import { computed } from 'vue'
import { ElInput, ElSelect, ElOption, ElButton } from 'element-plus'
import { Delete, View, Hide } from '@element-plus/icons-vue'
import type { AccountRowModel, AccountType } from '@/types/accounts'
import { ACCOUNT_TYPE_OPTIONS } from '@/types/accounts'

/**
 * Props
 */
const props = defineProps<{
  row: AccountRowModel
  showPassword: boolean
}>()

/**
 * Emits
 */
const emit = defineEmits<{
  (e: 'update:row', value: AccountRowModel): void
  (e: 'update:showPassword', value: boolean): void
  (e: 'blur', field: 'tags' | 'login' | 'password'): void
  (e: 'typeChange'): void
  (e: 'delete'): void
}>()

/**
 * Computed: является ли тип Локальная
 */
const isLocalType = computed(() => props.row.type === 'Локальная')

/**
 * Обновление поля tagsInput
 */
function updateTagsInput(value: string) {
  emit('update:row', { ...props.row, tagsInput: value })
}

/**
 * Обновление поля type
 */
function updateType(value: AccountType) {
  emit('update:row', { ...props.row, type: value })
  emit('typeChange')
}

/**
 * Обновление поля login
 */
function updateLogin(value: string) {
  emit('update:row', { ...props.row, login: value })
}

/**
 * Обновление поля password
 */
function updatePassword(value: string) {
  emit('update:row', { ...props.row, password: value })
}

/**
 * Переключение видимости пароля
 */
function togglePasswordVisibility() {
  emit('update:showPassword', !props.showPassword)
}

/**
 * Обработчики blur
 */
function onTagsBlur() {
  emit('blur', 'tags')
}

function onLoginBlur() {
  emit('blur', 'login')
}

function onPasswordBlur() {
  emit('blur', 'password')
}

/**
 * Удаление записи
 */
function onDelete() {
  emit('delete')
}
</script>

<template>
  <div class="account-row">
    <!-- Метки -->
    <div class="field field-tags">
      <ElInput
        :model-value="row.tagsInput"
        placeholder="Значение"
        :class="{ 'is-error': row.errors.tags }"
        @update:model-value="updateTagsInput"
        @blur="onTagsBlur"
      />
    </div>

    <!-- Тип записи -->
    <div class="field field-type">
      <ElSelect
        :model-value="row.type"
        placeholder="Выберите тип"
        @update:model-value="updateType"
      >
        <ElOption
          v-for="option in ACCOUNT_TYPE_OPTIONS"
          :key="option"
          :label="option"
          :value="option"
        />
      </ElSelect>
    </div>

    <!-- Логин -->
    <div class="field field-login">
      <ElInput
        :model-value="row.login"
        placeholder="Значение"
        :class="{ 'is-error': row.errors.login }"
        @update:model-value="updateLogin"
        @blur="onLoginBlur"
      />
    </div>

    <!-- Пароль (только для Локальная) -->
    <div class="field field-password">
      <template v-if="isLocalType">
        <ElInput
          :model-value="row.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Значение"
          :class="{ 'is-error': row.errors.password }"
          @update:model-value="updatePassword"
          @blur="onPasswordBlur"
        >
          <template #suffix>
            <ElButton
              link
              class="password-toggle"
              @click="togglePasswordVisibility"
            >
              <component :is="showPassword ? Hide : View" />
            </ElButton>
          </template>
        </ElInput>
      </template>
    </div>

    <!-- Кнопка удаления -->
    <div class="field field-delete">
      <ElButton
        type="danger"
        :icon="Delete"
        circle
        plain
        @click="onDelete"
      />
    </div>
  </div>
</template>

<style scoped>
.account-row {
  display: grid;
  grid-template-columns: 1fr 150px 1fr 1fr 50px;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
}

.account-row:last-child {
  border-bottom: none;
}

.field {
  min-width: 0;
}

.field-tags {
  min-width: 120px;
}

.field-type :deep(.el-select) {
  width: 100%;
}

.field-password {
  min-height: 32px;
}

.field-delete {
  display: flex;
  justify-content: center;
}

/* Красная обводка для невалидных полей */
:deep(.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

:deep(.is-error .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

:deep(.is-error .el-input__wrapper:focus-within) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

.password-toggle {
  padding: 0;
  margin: 0;
}

.password-toggle :deep(.el-icon) {
  color: #909399;
  cursor: pointer;
}

.password-toggle :deep(.el-icon:hover) {
  color: #409eff;
}
</style>

