import { createRouter, createWebHistory } from 'vue-router'

import houseList from '../components/Houses/houseList.vue';
import editHouse from '../components/Houses/editHouse.vue';
import viewHouse from '../components/Houses/viewHouse.vue';

const routes = [
  { path: '/', component: houseList },
  { path: '/Houses', component: houseList },
  { path: '/Houses/:id/edit', component: editHouse },
  { path: '/Houses/create', component: editHouse },
  { path: '/Houses/:id', component: viewHouse },
  { path: '/Houses/history', component: houseList },
  { path: '/Houses/favorites', component: houseList },
  { path: '/Houses/mylistings', component: houseList },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
