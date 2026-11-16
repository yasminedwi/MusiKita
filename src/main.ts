import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { IonicVue } from '@ionic/vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

/* Ionic Dark Mode */
import '@ionic/vue/css/palettes/dark.system.css'

/* Theme variables */
import './theme/variables.css'

/* jeep-sqlite */
import { defineCustomElements } from 'jeep-sqlite/loader'

const startApp = async () => {
  /*
   * Register jeep-sqlite only when running in the browser.
   */
  await defineCustomElements(window)

  const app = createApp(App)

  app
    .use(IonicVue)
    .use(router)

  await router.isReady()

  app.mount('#app')
}

startApp().catch((error) => {
  console.error('[MusiKita] Failed to start app:', error)
})