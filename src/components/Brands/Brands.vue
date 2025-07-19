<script setup lang="ts">
import '@/assets/tailwind.css'
import TitlePage from '../core/TitlePage.vue';
import BrandTable from './BrandTable.vue';
</script>

<template>
  <TitlePage title="Brands" description="Manage your brands here" />
  <BrandTable />
</template>
