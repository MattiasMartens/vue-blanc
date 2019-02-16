export const constructProps = (props: {
  nilOption?: string;
  options: (string | Option)[];
  optionComponent?: Vue.Component;
}) => {
  return Object.assign(props, {options: props.options.map(stringOrOption => typeof stringOrOption === 'string' ? {name: stringOrOption} : stringOrOption)});
};

export type Option = {
  name: string;
  value?: any;
  decorative?: boolean;
  disabled?: boolean;
};

export { default as SlateSelect } from './select.vue';
