import { createApp } from 'vue'
import SmoothVuebar from 'smooth-vuebar'
import App from './App.vue'
import './style.css'

createApp(App)
  .use(SmoothVuebar, { options: { damping: 0.08 } })
  .mount('#app')
