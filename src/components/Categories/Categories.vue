<script setup lang="ts">
import '@/assets/tailwind.css'
import TitlePage from '../core/TitlePage.vue';
import CategoryTable from './CategoryTable.vue';
</script>

<template>
  <TitlePage title="Categories" description="Manage your categories here" />
  <CategoryTable />
</template>
