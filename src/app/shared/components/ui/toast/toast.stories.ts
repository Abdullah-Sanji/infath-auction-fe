import type { Meta, StoryObj } from '@storybook/angular';
import { Toast } from './toast';
import { Button } from '../button/button';
import { CommonModule } from '@angular/common';

const meta: Meta<Toast> = {
  component: Toast,
  title: 'UI Components/Toast',
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      ...story(),
      moduleMetadata: {
        imports: [CommonModule],
      },
    }),
  ],
  argTypes: {
    position: {
      control: 'select',
      options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'center'],
      description: 'Toast position',
    },
    life: {
      control: 'number',
      description: 'Life duration in milliseconds',
    },
    sticky: {
      control: 'boolean',
      description: 'Whether toast stays visible until manually closed',
    },
    showCloseIcon: {
      control: 'boolean',
      description: 'Whether to show close icon',
    },
  },
};

export default meta;
type Story = StoryObj<Toast>;

export const Default: Story = {
  render: () => ({
    template: `
      <lib-toast #toast></lib-toast>
      <div class="flex flex-col gap-2">
        <lib-button label="Success" [severity]="'success'" (onClick)="toast.showSuccess('Success', 'Operation completed successfully')"></lib-button>
        <lib-button label="Info" [severity]="'info'" (onClick)="toast.showInfo('Info', 'Here is some information')"></lib-button>
        <lib-button label="Warning" [severity]="'warn'" (onClick)="toast.showWarn('Warning', 'Please be careful')"></lib-button>
        <lib-button label="Error" [severity]="'danger'" (onClick)="toast.showError('Error', 'Something went wrong')"></lib-button>
        <lib-button label="Clear All" [outlined]="true" (onClick)="toast.clear()"></lib-button>
      </div>
    `,
  }),
};

export const TopLeft: Story = {
  render: () => ({
    template: `
      <lib-toast #toast [position]="'top-left'"></lib-toast>
      <lib-button label="Show Toast" (onClick)="toast.showSuccess('Top Left', 'Toast appears at top-left')"></lib-button>
    `,
  }),
};

export const TopCenter: Story = {
  render: () => ({
    template: `
      <lib-toast #toast [position]="'top-center'"></lib-toast>
      <lib-button label="Show Toast" (onClick)="toast.showInfo('Top Center', 'Toast appears at top-center')"></lib-button>
    `,
  }),
};

export const TopRight: Story = {
  render: () => ({
    template: `
      <lib-toast #toast [position]="'top-right'"></lib-toast>
      <lib-button label="Show Toast" (onClick)="toast.showSuccess('Top Right', 'Toast appears at top-right')"></lib-button>
    `,
  }),
};

export const BottomLeft: Story = {
  render: () => ({
    template: `
      <lib-toast #toast [position]="'bottom-left'"></lib-toast>
      <lib-button label="Show Toast" (onClick)="toast.showWarn('Bottom Left', 'Toast appears at bottom-left')"></lib-button>
    `,
  }),
};

export const BottomCenter: Story = {
  render: () => ({
    template: `
      <lib-toast #toast [position]="'bottom-center'"></lib-toast>
      <lib-button label="Show Toast" (onClick)="toast.showInfo('Bottom Center', 'Toast appears at bottom-center')"></lib-button>
    `,
  }),
};

export const BottomRight: Story = {
  render: () => ({
    template: `
      <lib-toast #toast [position]="'bottom-right'"></lib-toast>
      <lib-button label="Show Toast" (onClick)="toast.showSuccess('Bottom Right', 'Toast appears at bottom-right')"></lib-button>
    `,
  }),
};

export const Sticky: Story = {
  render: () => ({
    template: `
      <lib-toast #toast [sticky]="true"></lib-toast>
      <lib-button label="Show Sticky Toast" (onClick)="toast.showInfo('Sticky Toast', 'This toast will not auto-close')"></lib-button>
    `,
  }),
};

export const CustomLife: Story = {
  render: () => ({
    template: `
      <lib-toast #toast [life]="10000"></lib-toast>
      <lib-button label="Show Long Toast" (onClick)="toast.showSuccess('Long Duration', 'This toast stays for 10 seconds')"></lib-button>
    `,
  }),
};

export const WithoutCloseIcon: Story = {
  render: () => ({
    template: `
      <lib-toast #toast [showCloseIcon]="false"></lib-toast>
      <lib-button label="Show Toast" (onClick)="toast.showInfo('No Close Icon', 'This toast has no close button')"></lib-button>
    `,
  }),
};

export const MultipleToasts: Story = {
  render: () => ({
    template: `
      <lib-toast #toast></lib-toast>
      <lib-button label="Show Multiple Toasts" (onClick)="showMultiple(toast)"></lib-button>
    `,
    props: {
      showMultiple: (toast: Toast) => {
        toast.showSuccess('First', 'First toast message');
        setTimeout(() => toast.showInfo('Second', 'Second toast message'), 500);
        setTimeout(() => toast.showWarn('Third', 'Third toast message'), 1000);
      },
    },
  }),
};

export const AllSeverities: Story = {
  render: () => ({
    template: `
      <lib-toast #toast></lib-toast>
      <div class="flex flex-col gap-2">
        <lib-button label="Success Toast" [severity]="'success'" (onClick)="toast.showSuccess('Success', 'Operation completed')"></lib-button>
        <lib-button label="Info Toast" [severity]="'info'" (onClick)="toast.showInfo('Information', 'Here is some info')"></lib-button>
        <lib-button label="Warning Toast" [severity]="'warn'" (onClick)="toast.showWarn('Warning', 'Please be careful')"></lib-button>
        <lib-button label="Error Toast" [severity]="'danger'" (onClick)="toast.showError('Error', 'An error occurred')"></lib-button>
      </div>
    `,
  }),
};
