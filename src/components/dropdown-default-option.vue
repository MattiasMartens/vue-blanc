<template>
  <div v-on="$listeners">{{option}}</div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    index: Number,
    option: String,
    value: {},
    currentSelectedValue: {}
  }
});
</script>