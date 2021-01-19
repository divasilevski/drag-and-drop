<template lang="pug">
.clock-widget
  .clock-widget__wrapper
    .clock-widget__timer {{ number }}
    .clock-widget__placeholder 88:88:88
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { getCurrentDate } from "./widgets.helpers";

export default defineComponent({
  setup() {
    const number = ref(getCurrentDate());
    setInterval(() => (number.value = getCurrentDate()), 1000);
    return { number };
  },
});
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "digital-7";
  src: url("../../assets/fonts/digital-7.ttf");
}

.clock-widget {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  background: #d4daae;
  border-radius: 10px;
  margin: 10px;
  font-family: "digital-7", monospace;
  font-size: 56px;

  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);

  .clock-widget__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 6%;

    .clock-widget__placeholder {
      position: absolute;
      opacity: 0.2;
    }
  }

  @media screen and (max-width: 800px) {
    font-size: calc(7vw);
  }
}
</style>
