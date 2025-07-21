<template>
    <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <template v-for="product in products" :key="product.id">
                <ProductCard :product="product" />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import '@/assets/tailwind.css';
import ProductCard from './ProductCard.vue';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  available: boolean;
  categoryId: string;
  brandId: string;
  category?: { id: string; name: string };
  brand?: { id: string; name: string };
}

// Recibimos la lista de productos como props
defineProps<{
  products: Product[];
}>();
</script>