<template>
  <div>
    <SlateDropdown
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

import { default as SlateDropdown, constructProps } from "./components/dropdown.vue";

export default Vue.extend({
  components: {
    SlateDropdown
  },
  data() {
    return {
      selectedOption: undefined,
      dropdownProps: constructProps({
        groupedOptions: [{ options: ["A", "B"] }, { options: ["C"], name: "cheeze" }],
        values: {
          A: "hippo",
          B: "walrus",
          C: "eagle"
        },
        rawHtml: {
          A: "<strong>STEGOSAURUS</strong>"
        },
        disabled: {
          B: true
        },
        nilOption: "Select one"
      })
    };
  }
});
</script>