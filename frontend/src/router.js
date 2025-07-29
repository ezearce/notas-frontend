// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  // Podés agregar más rutas si querés una ruta específica para crear o editar notas
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
