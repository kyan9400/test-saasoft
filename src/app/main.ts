import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'

const app = createApp(App)

// Регистрация Pinia
const pinia = createPinia()
app.use(pinia)

// Регистрация Element Plus
app.use(ElementPlus, { locale: undefined })

// Регистрация иконок Element Plus
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')

