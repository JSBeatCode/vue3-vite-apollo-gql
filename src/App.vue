<script setup>
import ApolloData from './components/ApolloData.vue';
import Test from './components/Test.vue';
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="./assets/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <a href="" target="_blank">
      <img src="./assets/apollographql-icon.svg" class="logo vue" alt="Vue logo" />
    </a>
    <a href="" target="_blank">
      <img src="./assets/graphql-icon.svg" class="logo vue" alt="Vue logo" />
    </a>
    <ApolloData />
    <!-- <Test /> -->
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
