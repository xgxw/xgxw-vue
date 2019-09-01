<template>
  <div id="app">
    <router-view />
    <command-bar />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CommandBar from "@/views/components/XCommandBar.vue";

@Component({
  components: {
    "command-bar": CommandBar
  }
})
export default class App extends Vue {
  mounted() {}
}
</script>

<style lang='scss'>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>