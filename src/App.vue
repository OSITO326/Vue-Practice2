<script setup lang="ts">
import './assets/main.css'
import SideBar from './components/core/SideBar.vue';
</script>

<template>
  <div class="flex h-screen">
    <SideBar />
    <div class="flex w-full h-screen overflow-y-auto">
      <main class="w-full p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>
