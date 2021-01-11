<template lang="pug">
div
  h1 MyComponentTemplate
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "MyFirstComponent",
  props: {
    msg: String,
  },
});
</script>

<style lang=""></style>
