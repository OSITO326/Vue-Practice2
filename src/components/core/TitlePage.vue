<script setup lang="ts">
import '@/assets/tailwind.css'

defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <header class="ui__header">
    <div class="container">
      <h class="text-3xl">{{ title }}</h>
      <p>{{ description }}</p>
    </div>
  </header>
</template>
