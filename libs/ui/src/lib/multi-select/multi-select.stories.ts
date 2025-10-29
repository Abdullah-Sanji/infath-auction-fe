import type { Meta, StoryObj } from '@storybook/angular';
import { MultiSelect } from './multi-select';

const meta: Meta<MultiSelect> = {
  component: MultiSelect,
  title: 'UI Components/MultiSelect',
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of options to display',
    },
    value: {
      control: 'object',
      description: 'Selected values array',
    },
    optionLabel: {
      control: 'text',
      description: 'Property name to use as the label',
    },
    optionValue: {
      control: 'text',
      description: 'Property name to use as the value',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
      description: 'MultiSelect variant style',
    },
    display: {
      control: 'select',
      options: ['comma', 'chip'],
      description: 'Display mode for selected items',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the multiselect is disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the multiselect is readonly',
    },
    filter: {
      control: 'boolean',
      description: 'Whether to show filter input',
    },
    showToggleAll: {
      control: 'boolean',
      description: 'Whether to show select all checkbox',
    },
    showClear: {
      control: 'boolean',
      description: 'Whether to show clear button',
    },
    loading: {
      control: 'boolean',
      description: 'Whether multiselect is in loading state',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether multiselect shows invalid state',
    },
    fluid: {
      control: 'boolean',
      description: 'Whether multiselect takes full width',
    },
    maxSelectedLabels: {
      control: 'number',
      description: 'Maximum labels to display before showing count',
    },
  },
};

export default meta;
type Story = StoryObj<MultiSelect>;

const simpleOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

const cityOptions = [
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
  { name: 'Tokyo', code: 'TKY' },
  { name: 'Berlin', code: 'BER' },
  { name: 'Madrid', code: 'MAD' },
  { name: 'Sydney', code: 'SYD' },
  { name: 'Toronto', code: 'TOR' },
];

const groupedOptions = [
  {
    label: 'Europe',
    items: [
      { name: 'London', code: 'LDN' },
      { name: 'Paris', code: 'PRS' },
      { name: 'Berlin', code: 'BER' },
      { name: 'Rome', code: 'RM' },
    ],
  },
  {
    label: 'Asia',
    items: [
      { name: 'Tokyo', code: 'TKY' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Dubai', code: 'DXB' },
    ],
  },
  {
    label: 'America',
    items: [
      { name: 'New York', code: 'NY' },
      { name: 'Toronto', code: 'TOR' },
      { name: 'Los Angeles', code: 'LA' },
    ],
  },
];

export const Default: Story = {
  args: {
    options: simpleOptions,
    placeholder: 'Select items',
  },
};

export const WithValue: Story = {
  args: {
    options: simpleOptions,
    value: ['Option 1', 'Option 3'],
    placeholder: 'Select items',
  },
};

export const ObjectOptions: Story = {
  args: {
    options: cityOptions,
    optionLabel: 'name',
    optionValue: 'code',
    placeholder: 'Select cities',
  },
};

export const WithFilter: Story = {
  args: {
    options: cityOptions,
    optionLabel: 'name',
    filter: true,
    placeholder: 'Search and select cities',
  },
};

export const ChipDisplay: Story = {
  args: {
    options: cityOptions,
    optionLabel: 'name',
    value: [cityOptions[0], cityOptions[2], cityOptions[4]],
    display: 'chip',
    placeholder: 'Select cities',
  },
};

export const CommaDisplay: Story = {
  args: {
    options: cityOptions,
    optionLabel: 'name',
    value: [cityOptions[0], cityOptions[2], cityOptions[4]],
    display: 'comma',
    placeholder: 'Select cities',
  },
};

export const MaxSelectedLabels: Story = {
  args: {
    options: cityOptions,
    optionLabel: 'name',
    value: [cityOptions[0], cityOptions[1], cityOptions[2], cityOptions[3]],
    maxSelectedLabels: 2,
    placeholder: 'Select cities',
  },
};

export const WithClear: Story = {
  args: {
    options: simpleOptions,
    value: ['Option 1', 'Option 2'],
    showClear: true,
    placeholder: 'Select items',
  },
};

export const NoToggleAll: Story = {
  args: {
    options: simpleOptions,
    showToggleAll: false,
    placeholder: 'Select items (no toggle all)',
  },
};

export const Filled: Story = {
  args: {
    options: simpleOptions,
    variant: 'filled',
    placeholder: 'Filled variant',
  },
};

export const Outlined: Story = {
  args: {
    options: simpleOptions,
    variant: 'outlined',
    placeholder: 'Outlined variant',
  },
};

export const Disabled: Story = {
  args: {
    options: simpleOptions,
    disabled: true,
    value: ['Option 1', 'Option 2'],
    placeholder: 'Disabled multiselect',
  },
};

export const Readonly: Story = {
  args: {
    options: simpleOptions,
    readonly: true,
    value: ['Option 1', 'Option 3'],
    placeholder: 'Readonly multiselect',
  },
};

export const Invalid: Story = {
  args: {
    options: simpleOptions,
    invalid: true,
    placeholder: 'Invalid multiselect',
  },
};

export const Loading: Story = {
  args: {
    options: [],
    loading: true,
    placeholder: 'Loading...',
  },
};

export const Fluid: Story = {
  args: {
    options: simpleOptions,
    fluid: true,
    placeholder: 'Full width multiselect',
  },
};

export const GroupedOptions: Story = {
  args: {
    options: groupedOptions,
    optionLabel: 'name',
    optionValue: 'code',
    optionGroupLabel: 'label',
    optionGroupChildren: 'items',
    group: true,
    placeholder: 'Select cities by region',
  },
};

export const ManyOptions: Story = {
  args: {
    options: Array.from({ length: 50 }, (_, i) => `Option ${i + 1}`),
    filter: true,
    placeholder: 'Select from 50 options',
  },
};

export const VirtualScroll: Story = {
  args: {
    options: Array.from({ length: 10000 }, (_, i) => ({
      name: `Option ${i + 1}`,
      code: `OPT${i + 1}`,
    })),
    optionLabel: 'name',
    optionValue: 'code',
    virtualScroll: true,
    virtualScrollItemSize: 38,
    filter: true,
    placeholder: 'Virtual scroll with 10,000 options',
  },
};

export const AllSelected: Story = {
  args: {
    options: simpleOptions,
    value: simpleOptions,
    display: 'chip',
    placeholder: 'All items selected',
  },
};
