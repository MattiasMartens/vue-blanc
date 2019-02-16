<template>
  <div v-on="$listeners">{{option.name}}</div>
</template>
<script lang="ts">
import vue from 'vue';

import { Option } from '.';

export default vue.extend({
  props: {
    index: Number,
    option: Object as () => Option,
    currentSelectedOption: Object as () => Option,
    currentFocusedOption: Object as () => Option
  },
});
</script>