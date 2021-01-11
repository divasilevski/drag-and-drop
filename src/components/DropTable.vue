<template lang="pug">
.drop-table
  #drop
    .box(
      v-for="(item, index) in 12" :key="item" 
      :data-id="index"
      @dragenter="enter(index)"
    )
      component(:is="table[index]" @dragstart="start(index)" @dragend="end(index)") 

</template>

<script lang="ts">
import { defineComponent } from "vue";
import DrugBox from "./DrugBox.vue";
import DrugBoxBig from "./DrugBoxBig.vue";

export default defineComponent({
  components: {
    "drug-box": DrugBox,
    "drug-box-big": DrugBoxBig,
  },
  data: () => ({
    table: [
      null,
      null,
      "drug-box",
      "drug-box",
      "drug-box",
      "drug-box-big",
      null,
      null,
    ],
    drugArea: null as number | null,
  }),
  created() {
    console.log(this.$options);
  },
  methods: {
    start(index: number) {
      // По хорошему создавать ивент ентера и енда
    },
    enter(index: number) {
      this.drugArea = index;
    },
    end(index: number) {
      console.log(this.drugArea, index);
      if (this.drugArea !== null) {
        this.table[this.drugArea] = this.table[index];
        this.table[index] = null;
        this.drugArea = null;
      }
    },
  },
});
</script>

<style lang="scss">
#drop {
  position: relative;
  width: 800px;
  height: 600px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  .box {
    margin: 10px;
    background: #ccc;
    border-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
