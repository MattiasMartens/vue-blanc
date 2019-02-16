<template>
  <div>
    <SlateSelect
      v-bind="dropdownProps"
      v-model="selectedOption"
    />
    <p>
      Selected value: {{selectedOption}}
    </p>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { SlateSelect, constructProps, Option } from "./components/select";

export default Vue.extend({
  components: {
    SlateSelect
  },
  data() {
    return {
      selectedOption: undefined,
      dropdownProps: constructProps({
        options: ["AAAAAAAAA", {name: "BBBB", decorative: true}, "CCCCCC", "D"],
        nilOption: "Select one"
      })
    };
  }
});
</script>