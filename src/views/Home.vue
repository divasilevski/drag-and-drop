<template lang="pug">
div
  DropTable
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DropTable from "@/components/DropTable.vue";

export default defineComponent({
  name: "Home",
  components: {
    DropTable,
  },
});
</script>
