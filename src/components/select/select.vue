<template>
  <div
    :class="classHooks.component"
    @keydown.up="scrollUp"
    @keydown.down="scrollDown"
    @slate-push="onPush"
    v-push
    @blur="onBlur"
  >
    <component
      :is="realSelectionComponent"
      :currentSelectedOption="selectedOption"
      :class="classHooks.selection"
      @click="onClick"
    />
    <div v-if="selecting" :class="classHooks.container">
      <component
        :is="realOptionComponent"
        v-for="(option, index) in options"
        :key="getValue(option)"
        :index="index"
        :option="option"
        :currentSelectedOption="option"
        :currentFocusedOption="focusedOption"
        @mouseover="focusOption(option)"
        @click="onOptionClick(option)"
        :class="getOptionClass(option)"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { ComponentOptions } from 'vue';
import push from '../../directives/push';
import SelectDefaultOptionVue from './select-default-option.vue';
import SelectDefaultSelectionVue from './select-default-selection.vue';
import { Option } from '.';

function cycle(num: number, width: number) {
  const ret = num % width;

  return ret >= 0 ? ret : width + ret;
}

export default Vue.extend({
  props: {
    nilOption: {
      type: String,
      required: false,
    },
    options: {
      type: Array as () => Option[],
    },
    value: {},
    values: {
      type: Object as () => { [option: string]: any },
    },
    optionComponent: {
      type: Object as () => Vue.Component,
    },
    selectionComponent: {
      type: Object as () => Vue.Component,
    }
  },
  data() {
    return {
      selecting: false,
      focusedOption: undefined as Option | undefined,
    };
  },
  directives: {
    push,
  },
  computed: {
    classHooks() {
      return classHooks;
    },
    realOptionComponent(): Vue.Component {
      return this.optionComponent || SelectDefaultOptionVue;
    },
    realSelectionComponent(): Vue.Component {
      return this.selectionComponent || SelectDefaultSelectionVue;
    },
    selectedOption(): Option | undefined {
      const selected = this.options.find(option => this.getValue(option) === this.value);

      if (selected) {
        return selected;
      } else if (this.nilOptionObject) {
        return this.nilOptionObject;
      } else {
        return undefined;
      }
    },
    nilOptionObject(): Option | undefined {
      return this.nilOption ? { name: this.nilOption, value: undefined } : undefined;
    }
  },
  mounted() {
    if (!this.nilOption) {
      this.selectOption(this.options[0]);
    }
  },
  watch: {
    options(newOptions) {
      if (this.selectedOption && newOptions.indexOf(this.selectedOption) === -1) {
        this.selectOption(undefined);
      }

      if (this.focusedOption && newOptions.indexOf(this.focusedOption) === -1) {
        this.focusedOption = undefined;
      }
    }
  },
  methods: {
    selectOption(option: Option | undefined) {
      this.$emit('input', this.getValue(option));
    },
    getValue(option: Option | undefined): any | undefined {
      if (option && 'value' in option) {
        return option.value;
      } else if (option) {
        return option.name;
      } else {
        return undefined;
      }
    },
    getOptionClass(option: Option) {
      const ret = [classHooks.option];
      option === this.selectedOption &&
        ret.push(classHooks.optionSelected);
      option === this.nilOptionObject && ret.push(classHooks.optionNil);
      this.focusedOption === option && ret.push(classHooks.optionFocus);
      option.disabled && ret.push(classHooks.optionDisabled);
      option.decorative && ret.push(classHooks.optionDecorative);

      return ret;
    },
    onPush() {
      if (this.selecting && this.focusedOption) {
        this.selectOption(this.focusedOption);
      }

      this.selecting = !this.selecting;
      this.focusedOption = undefined;
    },
    onClick() {
      this.selecting = !this.selecting;
      this.focusedOption = undefined;
    },
    onBlur() {
      this.selecting = false;
      this.focusedOption = undefined;
    },
    onOptionClick(option: Option) {
      if (!option.disabled && !option.decorative) {
        this.selectOption(option);
        this.selecting = false;
      }
    },
    focusOption(option: Option) {
      this.selectedOption !== option && (this.focusedOption = option);
    },
    nextOption(delta: number) {
      debugger;
      const currentIndex = this.focusedOption
        ? this.options.indexOf(this.focusedOption)
        : this.selectedOption && this.selectedOption !== this.nilOptionObject
        ? this.options.indexOf(this.selectedOption)
        : -1;

      if (currentIndex === -1) {
        const jumpIn = delta > 0 ? this.options[0] : this.options[this.options.length - 1];

        if (jumpIn !== this.selectedOption && !jumpIn.decorative && !jumpIn.disabled) {
          return jumpIn;
        }
      }

      let attempts = 0;

      while (attempts < this.options.length) {
        const newIndex = cycle(
          currentIndex + (delta * (attempts + 1)),
          this.options.length,
        );

        const newValue = this.options[newIndex];

        if (
          newValue !== this.selectedOption &&
          !newValue.decorative &&
          !newValue.disabled
        ) {
          return newValue;
        }

        attempts++;
      }
    },
    scrollUp() {
      this.focusedOption = this.nextOption(-1);
    },
    scrollDown() {
      this.focusedOption = this.nextOption(1);
    },
  },
});

export const classHooks = {
  component: 'slate--select',
  container: 'slate--select__container',
  option: 'slate--select__option',
  optionNil: 'slate--select__option--nil',
  selected: 'slate--select__selected',
  optionSelected: 'slate--select__option--selected',
  selection: 'slate--select__selection',
  optionFocus: 'slate--select__option--focus',
  optionDisabled: 'slate--select__option--disabled',
  optionDecorative: 'slate--select__option--decorative'
};
</script>
<style>
.slate--select__option--selected {
  font-weight: bold;
}

.slate--select__option--focus {
  color: #ccc;
}

.slate--select__option--disabled {
  color: #ccc;
}

.slate--select__option--decorative {
  padding-left: 0.5rem;
  color: #ccc;
}

.slate--select {
  width: min-content;
  user-select: none;
  font-family: arial, sans-serif;
  z-index: 1;
}

.slate--select__selection {
  min-width: 100%;
  width: max-content;
}

.slate--select__container {
  width: min-content;
  padding: 0.5rem;
  position: absolute;
  background-color: white;
  outline: 1px solid black;
}
</style>