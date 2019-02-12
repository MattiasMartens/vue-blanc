<template>
  <select
    :value="value"
    @input="updateValue()"
    ref="select"
    :class="classHooks.select"
  >
    <option
      v-if="nilOption"
      :value="nilValue"
      v-html="getHtml(nilOption)"
      :class="nilOptionClass"
      disabled
    >
      {{nilOption}}
    </option>
    <template v-if="groupedOptions">
      <template v-for="optionGroup in groupedOptions">
        <option
          disabled
          :key="optionGroup.name"
        >
          {{getLabel(optionGroup.name)}}
        </option>
        <template v-if="optionComponent">
          <component
            v-for="(option, index) in optionGroup.options"
            :is="optionComponent"
            :key="option"
            :value="getValue(option)"
            :disabled="isDisabled(option)"
            :class="getOptionClass(option)"
            :index="index"
            :data-group="optionGroup.name"
          />
        </template>
        <template v-else>
          <option
            v-for="option in optionGroup.options"
            :key="option"
            :value="getValue(option)"
            v-html="getHtml(option)"
            :disabled="isDisabled(option)"
            :class="getOptionClass(option)"
            :data-group="optionGroup.name"
          />
        </template>
      </template>
    </template>
    <template v-else-if="optionComponent">
      <option
        v-for="option in optionGroup.options"
        :key="option"
        :value="getValue(option)"
        :disabled="isDisabled(option)"
        :class="getOptionClass(option)"
      >
        {{option}}
      </option>
    </template>
    <template v-else>
      <option
        v-for="option in options"
        :key="option"
        :value="getValue(option)"
        :disabled="isDisabled(option)"
        :class="getOptionClass(option)"
      >
        {{option}}
      </option>
    </template>
  </select>
</template>
<script lang="ts">
import Vue, { ComponentOptions } from "vue";
import { escape } from "lodash";

export default Vue.extend({
  props: {
    nilOption: {
      type: String,
      required: false
    },
    options: {
      type: Array as () => string[]
    },
    groupedOptions: {
      type: Array as () => { options: string[], name?: string }[]
    },
    value: {},
    values: {
      type: Object as () => { [option: string]: any }
    },
    rawHtml: {
      type: Object as () => { [option: string]: string }
    },
    disabled: {
      type: Object as () => { [option: string]: boolean }
    },
    optionComponent: {
      type: Object as () => Vue.Component
    }
  },
  computed: {
    classHooks() {
      return classHooks;
    },
    nilValue(): any {
      if (this.nilOption) {
        if (this.values && this.nilOption in this.values) {
          return this.values[this.nilOption]
        } else {
          return undefined;
        }
      } else {
        return this.firstOption;
      }
    },
    firstOption(): string | undefined {
      if (this.groupedOptions) {
        return this.groupedOptions[0].options[0];
      } else if (this.options) {
        return this.options[0];
      } else {
        return undefined;
      }
    },
    nilOptionClass(): string[] {
      return [classHooks.option, classHooks.optionDisabled, classHooks.optionNil]
    }
  },
  mounted() {
    this.nilValue === undefined || this.$emit('input', this.nilValue);
  },
  methods: {
    updateValue() {
      this.$emit('input', (<HTMLSelectElement>this.$refs.select).value)
    },
    getValue(option: string) {
      return this.values && option in this.values ? this.values[option] : option;
    },
    getHtml(option: string) {
      return this.rawHtml && option in this.rawHtml ? this.rawHtml[option] : escape(option);
    },
    isDisabled(option: string) {
      return this.disabled && option in this.disabled ? this.disabled[option] : false;
    },
    getLabel(optionGroupName?: string) {
      return optionGroupName === undefined ? "──────────" : optionGroupName;
    },
    getOptionClass(option: string) {
      const ret = [classHooks.option];
      this.getValue(option) === this.value && ret.push(classHooks.optionSelected);
      this.isDisabled(option) && ret.push(classHooks.optionDisabled);

      return ret;
    }
  }
});

export const classHooks = {
  option: "slate--dropdown__option",
  optionDisabled: "slate--dropdown__option--disabled",
  optionGroup: "slate--dropdown__option-group",
  optionNil: "slate--dropdown__option--nil",
  select: "slate--dropdown__select",
  optionSelected: "slate--dropdown__option--selected"
};

export const constructProps = (props: {  nilOption?: string,
  options?: string[],
  groupedOptions?: { options: string[], name?: string }[],
  values?: { [option: string]: any },
  rawHtml?: { [option: string]: string },
  disabled?: { [option: string]: boolean },
  optionComponent?: Vue.Component
}) => {
  if (props.groupedOptions && props.options) {
    console.warn("Both options and grouped options provided, grouped options will override options");
  }

  return props;
};
</script>