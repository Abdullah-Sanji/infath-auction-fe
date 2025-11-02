import type { Meta, StoryObj } from '@storybook/angular';
import { Textarea } from './textarea';

const meta: Meta<Textarea> = {
  component: Textarea,
  title: 'UI Components/Textarea',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Current value of the textarea',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
      description: 'Textarea variant style',
    },
    rows: {
      control: 'number',
      description: 'Number of rows',
    },
    cols: {
      control: 'number',
      description: 'Number of columns',
    },
    autoResize: {
      control: 'boolean',
      description: 'Whether textarea auto-resizes',
    },
    size: {
      control: 'select',
      options: ['small', 'large', undefined],
      description: 'Textarea size',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the textarea is readonly',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the textarea shows invalid state',
    },
    maxlength: {
      control: 'number',
      description: 'Maximum character length',
    },
  },
};

export default meta;
type Story = StoryObj<Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
    rows: 5,
  },
};

export const WithValue: Story = {
  args: {
    value: 'This is a sample text that spans multiple lines.\nLine 2\nLine 3',
    rows: 5,
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Filled variant',
    rows: 5,
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    placeholder: 'Outlined variant',
    rows: 5,
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Small size',
    size: 'small',
    rows: 3,
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large size',
    size: 'large',
    rows: 5,
  },
};

export const AutoResize: Story = {
  args: {
    placeholder: 'Auto-resizing textarea',
    autoResize: true,
    rows: 3,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled textarea',
    disabled: true,
    value: 'Cannot edit this text',
    rows: 5,
  },
};

export const Readonly: Story = {
  args: {
    placeholder: 'Readonly textarea',
    readonly: true,
    value: 'This text is read-only',
    rows: 5,
  },
};

export const Invalid: Story = {
  args: {
    placeholder: 'Invalid textarea',
    invalid: true,
    value: 'Invalid value',
    rows: 5,
  },
};

export const WithMaxLength: Story = {
  args: {
    placeholder: 'Max 100 characters',
    maxlength: 100,
    rows: 5,
  },
};

export const CustomRowsCols: Story = {
  args: {
    placeholder: 'Custom dimensions',
    rows: 10,
    cols: 50,
  },
};


export const Fluid: Story = {
  args: {
    placeholder: 'Full width textarea',
    fluid: true,
    rows: 5,
  },
};

export const Required: Story = {
  args: {
    placeholder: 'Required field *',
    required: true,
    rows: 5,
  },
};

export const WithSpellcheck: Story = {
  args: {
    placeholder: 'Spellcheck enabled',
    spellcheck: true,
    rows: 5,
  },
};

