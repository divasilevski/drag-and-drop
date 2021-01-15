<template lang="pug">
div
  DropTable(:options="options" @change="saveBoard")
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DropTable from "@/components/DropTable.vue";

export default defineComponent({
  name: "Home",
  components: {
    DropTable,
  },
  setup() {
    const state = JSON.parse(localStorage.getItem("bordItems") || "{}");
    const options = {
      size: {
        col: 6,
        row: 5,
      },
      state,
    };

    const saveBoard = (items: any) => {
      localStorage.setItem("bordItems", JSON.stringify(items));
    };

    return { options, saveBoard };
  },
});
</script>
