import type { Meta, StoryObj } from '@storybook/angular';
import { Checkbox } from './checkbox';

const meta: Meta<Checkbox> = {
  component: Checkbox,
  title: 'UI Components/Checkbox',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'boolean',
      description: 'Two-way bindable boolean value',
    },
    label: {
      control: 'text',
      description: 'Label text displayed next to checkbox',
    },
    name: {
      control: 'text',
      description: 'Name attribute for form submission',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the checkbox is readonly',
    },
    required: {
      control: 'boolean',
      description: 'Whether the checkbox is required',
    },
    binary: {
      control: 'boolean',
      description: 'Whether checkbox uses binary mode (true/false values)',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
      description: 'Checkbox variant style',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether checkbox shows invalid state',
    },
  },
};

export default meta;
type Story = StoryObj<Checkbox>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

export const Checked: Story = {
  args: {
    label: 'I agree',
    value: true,
  },
};

export const Unchecked: Story = {
  args: {
    label: 'Subscribe to newsletter',
    value: false,
  },
};

export const Filled: Story = {
  args: {
    label: 'Filled variant',
    variant: 'filled',
  },
};

export const Outlined: Story = {
  args: {
    label: 'Outlined variant',
    variant: 'outlined',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
    value: true,
  },
};

export const DisabledUnchecked: Story = {
  args: {
    label: 'Disabled unchecked',
    disabled: true,
    value: false,
  },
};

export const Readonly: Story = {
  args: {
    label: 'Readonly checkbox',
    readonly: true,
    value: true,
  },
};

export const Required: Story = {
  args: {
    label: 'Required field *',
    required: true,
  },
};

export const Invalid: Story = {
  args: {
    label: 'Invalid checkbox',
    invalid: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    ariaLabel: 'Checkbox without visible label',
  },
};

export const BinaryMode: Story = {
  args: {
    label: 'Binary mode checkbox',
    binary: true,
    trueValue: 'yes',
    falseValue: 'no',
  },
};

export const CustomTrueFalse: Story = {
  args: {
    label: 'Custom values',
    binary: true,
    trueValue: 'enabled',
    falseValue: 'disabled',
    value: 'enabled' as any,
  },
};
