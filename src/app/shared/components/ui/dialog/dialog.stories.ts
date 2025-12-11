import type { Meta, StoryObj } from '@storybook/angular';
import { Dialog } from './dialog';
import { Button } from '../button/button';
import { CommonModule } from '@angular/common';

const meta: Meta<Dialog> = {
  component: Dialog,
  title: 'UI Components/Dialog',
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      ...story(),
      moduleMetadata: {
        imports: [Button, CommonModule],
      },
    }),
  ],
  argTypes: {
    header: {
      control: 'text',
      description: 'Header text',
    },
    visible: {
      control: 'boolean',
      description: 'Whether dialog is visible',
    },
    draggable: {
      control: 'boolean',
      description: 'Whether dialog is draggable',
    },
    resizable: {
      control: 'boolean',
      description: 'Whether dialog is resizable',
    },
    modal: {
      control: 'boolean',
      description: 'Whether dialog acts as modal',
    },
    maximizable: {
      control: 'boolean',
      description: 'Whether dialog can be maximized',
    },
    closable: {
      control: 'boolean',
      description: 'Whether dialog has close button',
    },
    dismissableMask: {
      control: 'boolean',
      description: 'Whether clicking mask closes dialog',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether ESC key closes dialog',
    },
    position: {
      control: 'select',
      options: ['center', 'top', 'bottom', 'left', 'right', 'topleft', 'topright', 'bottomleft', 'bottomright'],
      description: 'Dialog position',
    },
  },
};

export default meta;
type Story = StoryObj<Dialog>;

export const Default: Story = {
  args: {
    header: 'Dialog Title',
    visible: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-dialog
        [header]="header"
        [visible]="visible"
        [draggable]="draggable"
        [resizable]="resizable"
        [modal]="modal"
        [closable]="closable"
      >
        <p>This is the dialog content. You can put any content here.</p>
      </lib-dialog>
    `,
  }),
};

export const Simple: Story = {
  render: () => ({
    template: `
      <lib-button label="Open Dialog" (onClick)="showDialog = true"></lib-button>
      <lib-dialog
        header="Simple Dialog"
        [visible]="showDialog"
        (onHide)="showDialog = false"
        width="50vw"
      >
        <p>This is a simple dialog with basic content.</p>
      </lib-dialog>
    `,
    props: {
      showDialog: false,
    },
  }),
};

export const LongContent: Story = {
  render: () => ({
    template: `
      <lib-button label="Open Long Dialog" (onClick)="showDialog = true"></lib-button>
      <lib-dialog
        header="Dialog with Long Content"
        [visible]="showDialog"
        (onHide)="showDialog = false"
        width="50vw"
        height="60vh"
      >
        <p>This dialog contains a lot of content to demonstrate scrolling.</p>
        <div style="height: 1000px; padding: 1rem;">
          <p>Scrollable content here...</p>
          <p>More content...</p>
          <p>Even more content...</p>
        </div>
      </lib-dialog>
    `,
    props: {
      showDialog: false,
    },
  }),
};

export const WithFooter: Story = {
  render: () => ({
    template: `
      <lib-button label="Open Dialog with Footer" (onClick)="showDialog = true"></lib-button>
      <lib-dialog
        header="Dialog with Footer"
        [visible]="showDialog"
        (onHide)="showDialog = false"
        width="50vw"
      >
        <p>This dialog has action buttons in the footer.</p>
        <ng-template #footer>
          <div class="flex justify-end gap-2">
            <lib-button label="Cancel" [outlined]="true" (onClick)="showDialog = false"></lib-button>
            <lib-button label="Save" [severity]="'primary'" (onClick)="showDialog = false"></lib-button>
          </div>
        </ng-template>
      </lib-dialog>
    `,
    props: {
      showDialog: false,
    },
  }),
};

export const Draggable: Story = {
  render: () => ({
    template: `
      <lib-button label="Open Draggable Dialog" (onClick)="showDialog = true"></lib-button>
      <lib-dialog
        header="Draggable Dialog"
        [visible]="showDialog"
        [draggable]="true"
        (onHide)="showDialog = false"
        width="50vw"
      >
        <p>You can drag this dialog around the screen.</p>
      </lib-dialog>
    `,
    props: {
      showDialog: false,
    },
  }),
};

export const Resizable: Story = {
  render: () => ({
    template: `
      <lib-button label="Open Resizable Dialog" (onClick)="showDialog = true"></lib-button>
      <lib-dialog
        header="Resizable Dialog"
        [visible]="showDialog"
        [resizable]="true"
        (onHide)="showDialog = false"
        width="50vw"
      >
        <p>You can resize this dialog by dragging the corners.</p>
      </lib-dialog>
    `,
    props: {
      showDialog: false,
    },
  }),
};

export const Maximizable: Story = {
  render: () => ({
    template: `
      <lib-button label="Open Maximizable Dialog" (onClick)="showDialog = true"></lib-button>
      <lib-dialog
        header="Maximizable Dialog"
        [visible]="showDialog"
        [maximizable]="true"
        (onHide)="showDialog = false"
        width="50vw"
      >
        <p>You can maximize this dialog by clicking the maximize button.</p>
      </lib-dialog>
    `,
    props: {
      showDialog: false,
    },
  }),
};

export const DismissableMask: Story = {
  render: () => ({
    template: `
      <lib-button label="Open Dialog (Click Mask to Close)" (onClick)="showDialog = true"></lib-button>
      <lib-dialog
        header="Dismissable Mask"
        [visible]="showDialog"
        [dismissableMask]="true"
        (onHide)="showDialog = false"
        width="50vw"
      >
        <p>Click outside the dialog to close it.</p>
      </lib-dialog>
    `,
    props: {
      showDialog: false,
    },
  }),
};

export const NonModal: Story = {
  render: () => ({
    template: `
      <lib-button label="Open Non-Modal Dialog" (onClick)="showDialog = true"></lib-button>
      <lib-dialog
        header="Non-Modal Dialog"
        [visible]="showDialog"
        [modal]="false"
        (onHide)="showDialog = false"
        width="50vw"
      >
        <p>This dialog does not block interaction with the background.</p>
      </lib-dialog>
    `,
    props: {
      showDialog: false,
    },
  }),
};

export const Positioned: Story = {
  render: () => {
    const state = {
      showDialog: false,
      position: 'center' as 'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright',
    };
    return {
      template: `
        <div class="flex flex-col gap-2">
          <lib-button label="Top Left" (onClick)="openDialog('topleft')"></lib-button>
          <lib-button label="Top Right" (onClick)="openDialog('topright')"></lib-button>
          <lib-button label="Bottom Left" (onClick)="openDialog('bottomleft')"></lib-button>
          <lib-button label="Bottom Right" (onClick)="openDialog('bottomright')"></lib-button>
          <lib-button label="Center" (onClick)="openDialog('center')"></lib-button>
        </div>
        <lib-dialog
          header="Positioned Dialog"
          [visible]="state.showDialog"
          [position]="state.position"
          (onHide)="state.showDialog = false"
          width="30vw"
        >
          <p>This dialog is positioned at: {{ state.position }}</p>
        </lib-dialog>
      `,
      props: {
        state,
        openDialog: (pos: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright') => {
          state.position = pos;
          state.showDialog = true;
        },
      },
    };
  },
};

export const CustomWidth: Story = {
  render: () => ({
    template: `
      <lib-button label="Open Custom Width Dialog" (onClick)="showDialog = true"></lib-button>
      <lib-dialog
        header="Custom Width Dialog"
        [visible]="showDialog"
        width="80vw"
        (onHide)="showDialog = false"
      >
        <p>This dialog has a custom width of 80vw.</p>
      </lib-dialog>
    `,
    props: {
      showDialog: false,
    },
  }),
};
