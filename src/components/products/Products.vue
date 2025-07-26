<script setup lang="ts">
import '@/assets/tailwind.css'
import TitlePage from '../core/TitlePage.vue';
import ProductTable from './ProductTable.vue';
</script>

<template>
  <TitlePage title="Products" description="Manage your products here" />
  <ProductTable />
</template>
