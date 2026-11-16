import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import LibraryPage from '../views/LibraryPage.vue'
import PlaylistPage from '../views/PlaylistPage.vue'
import SearchPage from '../views/SearchPage.vue'
import NowPlayingPage from '../views/NowPlayingPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },

  {
    path: '/home',
    component: HomePage
  },

  {
    path: '/library',
    component: LibraryPage
  },

  {
    path: '/playlists',
    component: PlaylistPage
  },

  {
    path: '/search',
    component: SearchPage
  },

  {
    path: '/now-playing',
    component: NowPlayingPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router