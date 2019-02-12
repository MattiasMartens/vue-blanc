<template>
  <select
    :value="value"
    @input="updateValue()"
    ref="select"
    class="slate--dropdown__select"
  >
    <option
      v-if="nilOption"
      :value="nilValue"
      v-html="getHtml(nilOption)"
      disabled
    >
      {{nilOption}}
    </option>
    <template v-if="groupedOptions">
      <optgroup
        v-for="optionGroup in groupedOptions"
        :key="optionGroup.name"
        :label="getLabel(optionGroup.name)"
      >
        <template v-if="rawHtml">
          <option
            v-for="option in optionGroup.options"
            :key="option"
            :value="getValue(option)"
            v-html="getHtml(option)"
            :disabled="isDisabled(option)"
          />
        </template>
        <template v-else>
          <option
            v-for="option in optionGroup.options"
            :key="option"
            :value="getValue(option)"
            :disabled="isDisabled(option)"
          >
            {{option}}
          </option>
        </template>
      </optgroup>
    </template>
    <template v-else-if="rawHtml">
      <option
        v-for="option in options"
        :key="option"
        :value="getValue(option)"
        v-html="getHtml(option)"
        :disabled="isDisabled(option)"
      />
    </template>
    <template v-else>
      <option
        v-for="option in options"
        :key="option"
        :value="getValue(option)"
        :disabled="isDisabled(option)"
      >
        {{option}}
      </option>
    </template>
    <slot />
  </select>
</template>
<script lang="ts">
import Vue from "vue";
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
    }
  }
});

export const classHooks = {

};

export const constructProps = (props: {  nilOption?: string,
  options?: string[],
  groupedOptions?: { options: string[], name?: string }[],
  values?: { [option: string]: any },
  rawHtml?: { [option: string]: string },
  disabled?: { [option: string]: boolean }
}) => {
  if (props.groupedOptions && props.options) {
    console.warn("Both options and grouped options provided, grouped options will override options");
  }

  return props;
};
</script>