import type { Meta, StoryObj } from '@storybook/angular';
import { RadioButton } from './radio-button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const meta: Meta<RadioButton> = {
  component: RadioButton,
  title: 'UI Components/RadioButton',
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      ...story(),
      moduleMetadata: {
        imports: [FormsModule, CommonModule],
      },
    }),
  ],
  argTypes: {
    value: {
      control: 'text',
      description: 'Selected value (two-way binding). Radio button is checked when this matches optionValue.',
    },
    optionValue: {
      control: 'text',
      description: 'The value this radio button represents. When value matches this, the radio button is checked.',
    },
    name: {
      control: 'text',
      description: 'Name attribute for grouping radio buttons',
    },
    label: {
      control: 'text',
      description: 'Label text displayed next to radio button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio button is disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the radio button is readonly',
    },
    required: {
      control: 'boolean',
      description: 'Whether the radio button is required',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
      description: 'Radio button variant style',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether radio button shows invalid state',
    },
  },
};

export default meta;
type Story = StoryObj<RadioButton>;

export const Default: Story = {
  args: {
    name: 'radio-group',
    label: 'Option 1',
    optionValue: 'option1',
  },
};

export const Selected: Story = {
  args: {
    name: 'radio-group',
    label: 'Selected option',
    optionValue: 'option1',
    value: 'option1', // This matches optionValue, so it will be checked
  },
};

export const Filled: Story = {
  args: {
    name: 'radio-group',
    label: 'Filled variant',
    variant: 'filled',
    optionValue: 'option1',
  },
};

export const Outlined: Story = {
  args: {
    name: 'radio-group',
    label: 'Outlined variant',
    variant: 'outlined',
    optionValue: 'option1',
  },
};

export const Disabled: Story = {
  args: {
    name: 'radio-group',
    label: 'Disabled option',
    disabled: true,
    optionValue: 'option1',
  },
};

export const DisabledSelected: Story = {
  args: {
    name: 'radio-group',
    label: 'Disabled selected',
    disabled: true,
    optionValue: 'option1',
    value: 'option1', // Matches optionValue, so it will be checked
  },
};

export const Readonly: Story = {
  args: {
    name: 'radio-group',
    label: 'Readonly option',
    readonly: true,
    optionValue: 'option1',
    value: 'option1', // Matches optionValue, so it will be checked
  },
};

export const Required: Story = {
  args: {
    name: 'radio-group',
    label: 'Required option *',
    required: true,
    optionValue: 'option1',
  },
};

export const Invalid: Story = {
  args: {
    name: 'radio-group',
    label: 'Invalid option',
    invalid: true,
    optionValue: 'option1',
  },
};

export const WithoutLabel: Story = {
  args: {
    name: 'radio-group',
    ariaLabel: 'Radio button without visible label',
    optionValue: 'option1',
  },
};

export const RadioGroup: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-3">
        <lib-radio-button
          name="payment"
          label="Credit Card"
          [optionValue]="'credit'"
          [(ngModel)]="selectedPayment"
        ></lib-radio-button>
        <lib-radio-button
          name="payment"
          label="PayPal"
          [optionValue]="'paypal'"
          [(ngModel)]="selectedPayment"
        ></lib-radio-button>
        <lib-radio-button
          name="payment"
          label="Bank Transfer"
          [optionValue]="'bank'"
          [(ngModel)]="selectedPayment"
        ></lib-radio-button>
      </div>
      <p class="mt-4">Selected: {{ selectedPayment }}</p>
    `,
    props: {
      selectedPayment: 'credit',
    },
  }),
};

