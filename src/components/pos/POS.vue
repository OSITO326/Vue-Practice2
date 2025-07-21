<template>
    <TitlePage title="Point of Sale" description="Manage your sales here" />
    <ProductGrid :products="products" />
</template>

<script setup lang="ts">
import '@/assets/tailwind.css';
import TitlePage from '../core/TitlePage.vue';
import ProductGrid from './ProductGrid.vue';
import { ref, onMounted } from 'vue';

const products = ref([]);

onMounted(async () => {
    const env = import.meta.env;
    const fetchProducts = async () => {
        try {
            const response = await fetch(`${env.VITE_API_URL}/products`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    }

    products.value = await fetchProducts();
})

</script>