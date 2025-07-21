<template>
    <Card class="product__card mb-4">
        <template #header>
        <img
            class="product__card--image"
            style="width: 100%; height: auto;"
            :src="product.image"
            :alt="product.name"
        />
        </template>

        <template #subtitle>
            <h3 class="text-center text-2xl line-clamp1">{{ product.name }}</h3>
            <p class="text-center text-primary-500 font-bold text-2xl">{{ product.price }}$</p>
        </template>

        <template #content>
        <p class="text-center">
            {{ product.description }}
        </p>
        </template>
  </Card>
</template>

<script setup lang="ts">
import '@/assets/tailwind.css';

interface Product {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    available: boolean;
    categoryId: string;
    brandId: string;
    category?: Category;
    brand?: Brand;
}

interface Category {
    id: string;
    name: string;
}

interface Brand {
    id: string;
    name: string;
}


defineProps<{
  product: Product;
}>();

</script>
