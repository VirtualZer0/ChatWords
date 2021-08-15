import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Main from '../views/Main.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import(/* webpackChunkName: "game" */ '../views/Game.vue')
  },
  {
    path: '/gameover',
    name: 'GameOver',
    component: () => import(/* webpackChunkName: "gameover" */ '../views/GameOver.vue')
  },
  {
    path: '/nextlevel',
    name: 'NextLevel',
    component: () => import(/* webpackChunkName: "nextlevel" */ '../views/NextLevel.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
