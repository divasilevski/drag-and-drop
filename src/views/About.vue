<template lang="pug">
.about
  DropTable
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DropTable from "@/components/DropTable.vue";

export default defineComponent({
  name: "About",
  components: {
    DropTable,
  },
});
</script>

<style lang="scss">
.input-box {
  width: 300px;
}
</style>
