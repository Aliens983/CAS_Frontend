<template>
  <router-view v-slot="{ Component, route }">
    <transition name="route-fade">
      <Suspense>
        <component :is="Component" :key="route.fullPath" />
        <template #fallback>
          <RouteLoading />
        </template>
      </Suspense>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import RouteLoading from '@/components/RouteLoading.vue'
</script>
