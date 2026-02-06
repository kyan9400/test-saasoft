<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElIcon } from 'element-plus'
import { Plus, QuestionFilled } from '@element-plus/icons-vue'
import AccountsList from '@/components/accounts/AccountsList.vue'

/**
 * Ref для доступа к методам AccountsList
 */
const accountsListRef = ref<InstanceType<typeof AccountsList> | null>(null)

/**
 * Добавление новой записи
 */
function handleAddAccount() {
  accountsListRef.value?.addEmptyRow()
}
</script>

<template>
  <div class="accounts-page">
    <!-- Заголовок страницы -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">Учетные записи</h1>
        <ElButton
          type="primary"
          :icon="Plus"
          circle
          size="small"
          @click="handleAddAccount"
        />
      </div>
    </header>

    <!-- Подсказка -->
    <div class="hint-block">
      <ElIcon class="hint-icon"><QuestionFilled /></ElIcon>
      <span class="hint-text">
        Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
      </span>
    </div>

    <!-- Список учетных записей -->
    <AccountsList ref="accountsListRef" />
  </div>
</template>

<style scoped>
.accounts-page {
  padding: 0;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.hint-block {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f4f4f5;
  border-radius: 8px;
  margin-bottom: 20px;
}

.hint-icon {
  color: #909399;
  font-size: 16px;
  flex-shrink: 0;
}

.hint-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}
</style>

