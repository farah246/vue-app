<script setup lang="ts">
import {RouterView} from 'vue-router'
import navbar from "@/components/navbar.vue";
</script>

<template>
  <div id="app">
    <navbar />
    <RouterView />
  </div>
</template>
