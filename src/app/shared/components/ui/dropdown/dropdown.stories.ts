import type { Meta, StoryObj } from '@storybook/angular';
import { Dropdown } from './dropdown';

const meta: Meta<Dropdown> = {
  component: Dropdown,
  title: 'UI Components/Dropdown',
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of options to display',
    },
    value: {
      control: 'object',
      description: 'Selected value',
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
      description: 'Dropdown variant style',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the dropdown is disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the dropdown is readonly',
    },
    filter: {
      control: 'boolean',
      description: 'Whether to show filter input',
    },
    showClear: {
      control: 'boolean',
      description: 'Whether to show clear button',
    },
    loading: {
      control: 'boolean',
      description: 'Whether dropdown is in loading state',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether dropdown shows invalid state',
    },
    editable: {
      control: 'boolean',
      description: 'Whether dropdown is editable',
    },
    checkmark: {
      control: 'boolean',
      description: 'Whether to show checkmark on selected item',
    },
    fluid: {
      control: 'boolean',
      description: 'Whether dropdown takes full width',
    },
    virtualScroll: {
      control: 'boolean',
      description: 'Whether to use virtual scrolling',
    },
  },
};

export default meta;
type Story = StoryObj<Dropdown>;

const simpleOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

const objectOptions = [
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
];

export const Default: Story = {
  args: {
    options: simpleOptions,
    placeholder: 'Select an option',
  },
};

export const WithValue: Story = {
  args: {
    options: simpleOptions,
    value: 'Option 2',
    placeholder: 'Select an option',
  },
};

export const ObjectOptions: Story = {
  args: {
    options: objectOptions,
    optionLabel: 'name',
    optionValue: 'code',
    placeholder: 'Select a city',
  },
};

export const WithFilter: Story = {
  args: {
    options: objectOptions,
    optionLabel: 'name',
    filter: true,
    placeholder: 'Search cities',
  },
};

export const WithClear: Story = {
  args: {
    options: simpleOptions,
    value: 'Option 3',
    showClear: true,
    placeholder: 'Select an option',
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
    value: 'Option 1',
    placeholder: 'Disabled dropdown',
  },
};

export const Readonly: Story = {
  args: {
    options: simpleOptions,
    readonly: true,
    value: 'Option 2',
    placeholder: 'Readonly dropdown',
  },
};

export const Invalid: Story = {
  args: {
    options: simpleOptions,
    invalid: true,
    placeholder: 'Invalid dropdown',
  },
};

export const Loading: Story = {
  args: {
    options: [],
    loading: true,
    placeholder: 'Loading...',
  },
};

export const Editable: Story = {
  args: {
    options: simpleOptions,
    editable: true,
    placeholder: 'Type or select',
  },
};

export const WithCheckmark: Story = {
  args: {
    options: objectOptions,
    optionLabel: 'name',
    checkmark: true,
    value: objectOptions[0],
    placeholder: 'Select a city',
  },
};

export const Fluid: Story = {
  args: {
    options: simpleOptions,
    fluid: true,
    placeholder: 'Full width dropdown',
  },
};

export const ManyOptions: Story = {
  args: {
    options: Array.from({ length: 100 }, (_, i) => `Option ${i + 1}`),
    filter: true,
    placeholder: 'Select from 100 options',
  },
};

export const VirtualScroll: Story = {
  args: {
    options: Array.from({ length: 10000 }, (_, i) => ({
      name: `Option ${i + 1}`,
      code: `OPT${i + 1}`,
    })),
    optionLabel: 'name',
    virtualScroll: true,
    virtualScrollItemSize: 38,
    filter: true,
    placeholder: 'Virtual scroll with 10,000 options',
  },
};
