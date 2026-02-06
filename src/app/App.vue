<script setup lang="ts">
import AccountsPage from '@/pages/AccountsPage.vue'
</script>

<template>
  <div class="app-container">
    <AccountsPage />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>

