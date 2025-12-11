import type { Meta, StoryObj } from '@storybook/angular';
import { InputText } from './input-text';

const meta: Meta<InputText> = {
  component: InputText,
  title: 'UI Components/InputText',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Current value of the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
      description: 'Input variant style',
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
      description: 'HTML input type',
    },
    size: {
      control: 'select',
      options: ['small', 'large', undefined],
      description: 'Input size',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the input is readonly',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the input shows invalid state',
    },
    fluid: {
      control: 'boolean',
      description: 'Whether the input takes full width',
    },
    maxlength: {
      control: 'number',
      description: 'Maximum character length',
    },
  },
};

export default meta;
type Story = StoryObj<InputText>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Sample text',
    placeholder: 'Enter text...',
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Filled variant',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    placeholder: 'Outlined variant',
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Small size',
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large size',
    size: 'large',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    value: 'Cannot edit',
  },
};

export const Readonly: Story = {
  args: {
    placeholder: 'Readonly input',
    readonly: true,
    value: 'Read only value',
  },
};

export const Invalid: Story = {
  args: {
    placeholder: 'Invalid input',
    invalid: true,
    value: 'Invalid value',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter email',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter number',
  },
};

export const WithMaxLength: Story = {
  args: {
    placeholder: 'Max 10 characters',
    maxlength: 10,
  },
};

export const Fluid: Story = {
  args: {
    placeholder: 'Full width input',
    fluid: true,
  },
};

export const WithAutoComplete: Story = {
  args: {
    placeholder: 'Email with autocomplete',
    type: 'email',
    autocomplete: 'email',
  },
};
