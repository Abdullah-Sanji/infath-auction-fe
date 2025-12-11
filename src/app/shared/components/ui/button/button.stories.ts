import type { Meta, StoryObj } from '@storybook/angular';
import { Button } from './button';

const meta: Meta<Button> = {
  component: Button,
  title: 'UI Components/Button',
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Button label text',
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons icon class (e.g., "pi pi-check")',
    },
    iconPos: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      description: 'Position of the icon',
    },
    severity: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'help', 'contrast'],
      description: 'Button severity/color scheme',
    },
    size: {
      control: 'select',
      options: ['small', 'large', undefined],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button shows a loading state',
    },
    raised: {
      control: 'boolean',
      description: 'Whether the button has a raised style',
    },
    rounded: {
      control: 'boolean',
      description: 'Whether the button has rounded corners',
    },
    text: {
      control: 'boolean',
      description: 'Whether the button has text-only style',
    },
    outlined: {
      control: 'boolean',
      description: 'Whether the button has outlined style',
    },
    link: {
      control: 'boolean',
      description: 'Whether the button appears as a link',
    },
    fluid: {
      control: 'boolean',
      description: 'Whether the button takes full width',
    },
  },
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    severity: "primary",
    size: "small",
    loading: false,
    raised: false,
    rounded: false
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    severity: 'secondary',
  },
};

export const Success: Story = {
  args: {
    label: 'Success Button',
    severity: 'success',
  },
};

export const Info: Story = {
  args: {
    label: 'Info Button',
    severity: 'info',
  },
};

export const Warning: Story = {
  args: {
    label: 'Warning Button',
    severity: 'warn',
  },
};

export const Danger: Story = {
  args: {
    label: 'Danger Button',
    severity: "danger",
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Save',
    icon: 'pi pi-check',
    iconPos: 'left',
  },
};

export const IconRight: Story = {
  args: {
    label: 'Next',
    icon: 'pi pi-arrow-right',
    iconPos: 'right',
  },
};

export const IconOnly: Story = {
  args: {
    icon: 'pi pi-search',
    ariaLabel: 'Search',
  },
};

export const Raised: Story = {
  args: {
    label: 'Raised Button',
    raised: true,
  },
};

export const Rounded: Story = {
  args: {
    label: 'Rounded Button',
    rounded: true,
  },
};

export const Text: Story = {
  args: {
    label: 'Text Button',
    text: true,
  },
};

export const Outlined: Story = {
  args: {
    label: 'Outlined Button',
    outlined: true,
  },
};

export const Link: Story = {
  args: {
    label: 'Link Button',
    link: true,
  },
};

export const Small: Story = {
  args: {
    label: 'Small Button',
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    label: 'Large Button',
    size: 'large',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    label: 'Loading...',
    loading: true,
  },
};

export const WithBadge: Story = {
  args: {
    label: 'Notifications',
    icon: 'pi pi-bell',
    badge: '5',
    badgeSeverity: 'danger',
  },
};

export const Fluid: Story = {
  args: {
    label: 'Full Width Button',
    fluid: true,
  },
};
