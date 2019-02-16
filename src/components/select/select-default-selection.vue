<template>
  <div v-on="$listeners">{{currentSelectedOption.name}}</div>
</template>
<script lang="ts">
import vue from 'vue';

import { Option } from '.';

export default vue.extend({
  props: {
    currentSelectedOption: Object as () => Option,
  },
});
</script>