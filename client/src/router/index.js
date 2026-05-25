import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
    { path: '/news', name: 'News', component: () => import('../views/NewsPage.vue') },
    { path: '/models', name: 'Models', component: () => import('../views/ModelsPage.vue') },
    { path: '/products', name: 'Products', component: () => import('../views/ProductsPage.vue') },
  ],
  scrollBehavior() { return { top: 0 } }
})
