import Categories from '@/components/Categories/Categories.vue';
import Products from '@/components/products/Products.vue';
import Brands from '@/components/Brands/Brands.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/products', component: Products },
  { path: '/categories', component: Categories },
  { path: '/brands', component: Brands },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;