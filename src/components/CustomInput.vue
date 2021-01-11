<template lang="pug">
.custom-input
  label.custom-input__label(v-if="label" v-text="label")
  .custom-input__input(
    :value="value"
    @input="$emit('update:value', $event.target.value)"
    maxlength=50
    contenteditable
  )
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "CustomInput",
  props: {
    label: {
      type: [String],
      default: "",
    },
    value: {
      type: [String, Number],
      default: "",
    },
  },
});
</script>

<style lang="scss" scoped>
$padding: 10px;

.custom-input {
  position: relative;
  display: flex;
  flex-direction: column;

  .custom-input__label {
    font-size: 13px;
    line-height: 15px;
    font-weight: bold;
    margin-bottom: 5px;
    text-align: left;
  }
  .custom-input__input {
    background: #232323;
    position: relative;
    width: 100%;
    font-size: 16px;
    line-height: 18px;

    border: none;
    padding: $padding $padding $padding + 3px;
    color: #cccccc;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      height: 3px;
      background: green;
      width: 0;
      left: 0;
      bottom: 0;
      transition: 0.4s;
    }

    &:active,
    &:focus {
      outline: none;
      &::before {
        width: 100%;
      }
    }
  }
}
</style>
