import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 樣式：Bootstrap（含本風格變數覆寫）＋ Bootstrap Icons
import './scss/main.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Bootstrap JS：collapse、dropdown、tab、offcanvas 皆以 data-bs-* 屬性驅動
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

createApp(App).use(router).mount('#app')
