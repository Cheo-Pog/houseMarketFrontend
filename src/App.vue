<script>
import Navigation from './components/Navigation.vue'

export default {
  name: "App",
  components: {
    Navigation
  },
  watch: { //for chaning the background image
    $route(to) {
      document.body.className = 'background1';
      if (to.matched[0].path === '/Houses/:id/edit' || to.matched[0].path === '/Houses/create') {
        document.body.classList.add('background-img');
      }
    }
  }
};
</script>

<template>
   <navigation />
   <RouterView />
</template>

<style scoped>
</style>
