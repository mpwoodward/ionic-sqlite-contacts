import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import ('../views/HomePage.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsPage.vue')
  },
  {
    path: '/create-contact',
    name: 'create-contact',
    component: () => import('../views/ContactForm.vue')
  },
  {
    path: '/edit-contact/:id',
    name: 'edit-contact',
    component: () => import('../views/ContactForm.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
