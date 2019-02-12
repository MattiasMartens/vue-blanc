<template>
  <div
    :class="classHooks.component"
    @keydown.up="scrollUp"
    @keydown.down="scrollDown"
  >
    <div
      :class="classHooks.optionSelected"
      @slate-interact="onInteract"
      @blur="onBlur"
      v-interactive
      ref="selected"
    >
      {{selectedOption}}
    </div>
    <div
      v-if="selecting"
      :class="classHooks.container"
      @slate-interact="onInteract"
      @blur="onBlur"
      v-interactive
      ref="container"
    >
      <component
        :is="realOptionComponent"
        :value="getValue(nilOption)"
        :currentSelectedValue="value"
        :class="getOptionClass({  option: nilOption, nil: true })"
      />
      <component
        :is="realOptionComponent"
        v-for="(option, index) in options"
        :key="option"
        :index="index"
        :option="option"
        :value="getValue(option)"
        :currentSelectedValue="value"
        @mouseover="focusOption(option)"
        :class="getOptionClass({ option })"
      >
      </component>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { ComponentOptions } from "vue";
import interactive from "../directives/interactive";
import DefaultOptionComponent from "./dropdown-default-option.vue";

function cycle(num: number, width: number) {
  const ret = num % width;

  return ret >= 0 ? ret : width + ret;
}

export default Vue.extend({
  props: {
    nilOption: {
      type: String,
      required: false
    },
    options: {
      type: Array as () => string[]
    },
    value: {},
    values: {
      type: Object as () => { [option: string]: any }
    },
    optionComponent: {
      type: Object as () => Vue.Component
    },
  },
  data() {
    return { selecting: false, focusedOption: undefined as string | undefined };
  },
  directives: {
    interactive
  },
  computed: {
    classHooks() {
      return classHooks;
    },
    selectedOption(): string | undefined {
      if (this.values) {
        const option = this.options.find(opt => this.values[opt] === this.value);

        if (option) {
          return option;
        }
      }

      return this.value as string | undefined;
    },
    realOptionComponent(): Vue.Component {
      return this.optionComponent || DefaultOptionComponent;
    }
  },
  mounted() {
    if (this.value === undefined) {
      this.selectOption(this.nilOption || this.options[0]);
    }
  },
  methods: {
    selectOption(option: string) {
      this.$emit('input', this.getValue(option));
    },
    getValue(option: string | undefined) {
      return option && this.values && option in this.values ? this.values[option] : option;
    },
    getOptionClass({ option, nil }: { option: string, nil?: true }) {
      const ret = [classHooks.option];
      this.getValue(this.selectedOption) === this.value && ret.push(classHooks.optionSelected);
      nil && ret.push(classHooks.optionNil);
      this.focusedOption === option && ret.push(classHooks.optionFocus);

      return ret;
    },
    onInteract() {
      if (this.focusedOption) {
        this.selectOption(this.focusedOption);
      }

      this.selecting = !this.selecting;
    },
    onBlur() {
      const active = document.activeElement;
      if (this.$refs.selected !== active && this.$refs.container !== active) {
        this.selecting = false;
      }
    },
    focusOption(option: string) {
      this.selectedOption !== option && (this.focusedOption = option);
    },
    getSelectionIndex(delta: number) {
      const currentIndex = this.focusedOption === undefined ? 0 : this.options.indexOf(this.focusedOption);
      const newIndex = cycle(currentIndex + delta, this.options.length);

      if (this.getValue(this.options[newIndex]) === this.value) {
        return cycle(newIndex + delta, this.options.length)
      } else {
        return newIndex;
      }
    },
    scrollUp() {
      this.focusedOption = this.options[this.getSelectionIndex(-1)];
    },
    scrollDown() {
      this.focusedOption = this.options[this.getSelectionIndex(1)];
    }
  }
});

export const classHooks = {
  component: "slate--dropdown",
  container: "slate--dropdown__container",
  option: "slate--dropdown__option",
  optionNil: "slate--dropdown__option--nil",
  selected: "slate--dropdown__selected",
  optionSelected: "slate--dropdown__option--selected",
  optionFocus: "slate--dropdown__option--focus"
};

export const constructProps = (props: {
  nilOption?: string,
  options: string[],
  values?: { [option: string]: any },
  optionComponent?: Vue.Component
}) => {
  return props;
};

</script>
<style>
.slate--dropdown__option--selected {
  color: #888;
}

.slate--dropdown__option--focus {
  color: #ccc;
}
</style>