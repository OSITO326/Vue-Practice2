import Categories from '@/components/Categories/Categories.vue';
import Products from '@/components/products/Products.vue';
import Brands from '@/components/Brands/Brands.vue';
import { createRouter, createWebHistory } from 'vue-router';
import POS from '@/components/pos/POS.vue';

const routes = [
  { path: '/', component: POS },
  { path: '/products', component: Products },
  { path: '/categories', component: Categories },
  { path: '/brands', component: Brands },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;