<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import { Store01Icon } from '@hugeicons/core-free-icons';
import { adminSidebarMenu } from './constants/adminSideBar';
import { useRoute, RouterLink } from 'vue-router';

const route = useRoute();
</script>

<template>
  <nav class="sidemenu">
    <div class="sidemenu--logo">
      <HugeiconsIcon :icon="Store01Icon" :size="28" />
    </div>
    <ul class="sidemenu--items">
      <li
        v-for="item in adminSidebarMenu"
        :key="item.path"
        class="w-full"
      >
        <RouterLink
          :to="item.path"
          class="sidemenu__link"
          :class="{ 'sidemenu__link--active': route.path === item.path }"
        >
          <component :is="item.iconComponent" v-bind="item.iconProps" />
          {{ item.name }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
