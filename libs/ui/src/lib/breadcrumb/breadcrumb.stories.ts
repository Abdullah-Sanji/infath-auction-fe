import type { Meta, StoryObj } from '@storybook/angular';
import { Breadcrumb } from './breadcrumb';
import { MenuItem } from 'primeng/api';

const meta: Meta<Breadcrumb> = {
  component: Breadcrumb,
  title: 'UI Components/Breadcrumb',
  tags: ['autodocs'],
  argTypes: {
    model: {
      control: 'object',
      description: 'Array of menu items',
    },
    home: {
      control: 'object',
      description: 'Home menu item',
    },
  },
};

export default meta;
type Story = StoryObj<Breadcrumb>;

const basicItems: MenuItem[] = [
  { label: 'Products' },
  { label: 'Electronics' },
  { label: 'Computers' },
];

const itemsWithIcons: MenuItem[] = [
  { label: 'Products', icon: 'pi pi-box' },
  { label: 'Electronics', icon: 'pi pi-desktop' },
  { label: 'Computers', icon: 'pi pi-laptop' },
];

const itemsWithCommands: MenuItem[] = [
  { label: 'Home', command: () => console.log('Home clicked') },
  { label: 'Products', command: () => console.log('Products clicked') },
  { label: 'Electronics', command: () => console.log('Electronics clicked') },
  { label: 'Laptops' },
];

export const Default: Story = {
  args: {
    model: basicItems,
  },
};

export const WithHome: Story = {
  args: {
    model: basicItems,
    home: { icon: 'pi pi-home', routerLink: '/' },
  },
};

export const WithIcons: Story = {
  args: {
    model: itemsWithIcons,
    home: { icon: 'pi pi-home' },
  },
};

export const LongPath: Story = {
  args: {
    model: [
      { label: 'Home' },
      { label: 'Products' },
      { label: 'Electronics' },
      { label: 'Computers' },
      { label: 'Laptops' },
      { label: 'Gaming Laptops' },
      { label: 'High-End Gaming Laptops' },
    ],
    home: { icon: 'pi pi-home' },
  },
};

export const WithRouterLinks: Story = {
  args: {
    model: [
      { label: 'Home', routerLink: '/' },
      { label: 'Products', routerLink: '/products' },
      { label: 'Electronics', routerLink: '/products/electronics' },
      { label: 'Laptops' },
    ],
    home: { icon: 'pi pi-home', routerLink: '/' },
  },
};

export const WithUrl: Story = {
  args: {
    model: [
      { label: 'Home', url: '/' },
      { label: 'Products', url: '/products' },
      { label: 'Electronics', url: '/products/electronics' },
      { label: 'Laptops' },
    ],
    home: { icon: 'pi pi-home', url: '/' },
  },
};

export const WithCommands: Story = {
  args: {
    model: itemsWithCommands,
    home: { icon: 'pi pi-home', command: () => console.log('Home clicked') },
  },
};

export const CustomHomeIcon: Story = {
  args: {
    model: basicItems,
    home: { icon: 'pi pi-home' }
  },
};

export const WithoutHome: Story = {
  args: {
    model: basicItems,
  },
};

export const SingleItem: Story = {
  args: {
    model: [{ label: 'Current Page' }],
    home: { icon: 'pi pi-home' },
  },
};

export const WithSeparator: Story = {
  args: {
    model: basicItems,
    home: { icon: 'pi pi-home' },
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-breadcrumb
        [model]="model"
        [home]="home"
      >
        <ng-template #separatorTemplate>
          <span class="mx-2">/</span>
        </ng-template>
      </lib-breadcrumb>
    `,
  }),
};

export const CustomStyle: Story = {
  args: {
    model: basicItems,
    home: { icon: 'pi pi-home' },
    styleClass: 'custom-breadcrumb',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-breadcrumb
        [model]="model"
        [home]="home"
        [styleClass]="styleClass"
      ></lib-breadcrumb>
      <style>
        .custom-breadcrumb {
          background: #f0f0f0;
          padding: 1rem;
          border-radius: 4px;
        }
      </style>
    `,
  }),
};

