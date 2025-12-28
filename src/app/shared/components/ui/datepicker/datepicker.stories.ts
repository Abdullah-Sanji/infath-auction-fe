import type { Meta, StoryObj } from '@storybook/angular';
import { Datepicker } from './datepicker';

const meta: Meta<Datepicker> = {
  component: Datepicker,
  title: 'UI Components/Datepicker',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'date',
      description: 'Selected date value',
    },
    selectionMode: {
      control: 'select',
      options: ['single', 'multiple', 'range'],
      description: 'Selection mode',
    },
    dateFormat: {
      control: 'text',
      description: 'Date format string',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
      description: 'Datepicker variant style',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the datepicker is disabled',
    },
    readonlyInput: {
      control: 'boolean',
      description: 'Whether the input is readonly',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show calendar icon',
    },
    iconDisplay: {
      control: 'select',
      options: ['input', 'button'],
      description: 'Icon display position',
    },
    showTime: {
      control: 'boolean',
      description: 'Whether to show time picker',
    },
    timeOnly: {
      control: 'boolean',
      description: 'Whether to show only time picker',
    },
    hourFormat: {
      control: 'select',
      options: ['12', '24'],
      description: 'Hour format',
    },
    showButtonBar: {
      control: 'boolean',
      description: 'Whether to show today/clear buttons',
    },
    showClear: {
      control: 'boolean',
      description: 'Whether to show clear button',
    },
    inline: {
      control: 'boolean',
      description: 'Whether to display calendar inline',
    },
    touchUI: {
      control: 'boolean',
      description: 'Whether to use touch-friendly UI',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether datepicker shows invalid state',
    },
    fluid: {
      control: 'boolean',
      description: 'Whether datepicker takes full width',
    },
    minDate: {
      control: 'date',
      description: 'Minimum selectable date',
    },
    maxDate: {
      control: 'date',
      description: 'Maximum selectable date',
    },
    numberOfMonths: {
      control: 'number',
      description: 'Number of months to display',
    },
    view: {
      control: 'select',
      options: ['date', 'month', 'year'],
      description: 'Initial view',
    },
    firstDayOfWeek: {
      control: 'number',
      description: 'First day of week (0=Sunday)',
    },
    showWeek: {
      control: 'boolean',
      description: 'Whether to show week numbers',
    },
  },
};

export default meta;
type Story = StoryObj<Datepicker>;

export const Default: Story = {
  args: {
    placeholder: 'Select a date',
  },
};

export const WithValue: Story = {
  args: {
    value: new Date(2025, 0, 15),
    placeholder: 'Select a date',
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

export const Disabled: Story = {
  args: {
    disabled: true,
    value: new Date(2025, 0, 15),
    placeholder: 'Disabled datepicker',
  },
};

export const Readonly: Story = {
  args: {
    readonlyInput: true,
    value: new Date(2025, 0, 15),
    placeholder: 'Readonly datepicker',
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    placeholder: 'Invalid datepicker',
  },
};

export const WithTime: Story = {
  args: {
    showTime: true,
    hourFormat: '24',
    placeholder: 'Select date and time',
  },
};

export const TimeOnly: Story = {
  args: {
    timeOnly: true,
    hourFormat: '24',
    placeholder: 'Select time',
  },
};

export const Time12Hour: Story = {
  args: {
    showTime: true,
    hourFormat: '12',
    placeholder: 'Select date and time (12h)',
  },
};

export const WithSeconds: Story = {
  args: {
    showTime: true,
    showSeconds: true,
    hourFormat: '24',
    placeholder: 'Select date and time with seconds',
  },
};

export const MultipleSelection: Story = {
  args: {
    selectionMode: 'multiple',
    placeholder: 'Select multiple dates',
  },
};

export const RangeSelection: Story = {
  args: {
    selectionMode: 'range',
    placeholder: 'Select date range',
  },
};

export const WithMinMax: Story = {
  args: {
    minDate: new Date(2025, 0, 1),
    maxDate: new Date(2025, 11, 31),
    placeholder: 'Select date in 2025',
  },
};

export const WithDisabledDates: Story = {
  args: {
    disabledDates: [
      new Date(2025, 0, 1),
      new Date(2025, 0, 2),
      new Date(2025, 0, 3),
    ],
    placeholder: 'Some dates disabled',
  },
};

export const WithDisabledDays: Story = {
  args: {
    disabledDays: [0, 6], // Sunday and Saturday
    placeholder: 'Weekends disabled',
  },
};

export const WithNavigators: Story = {
  args: {
    placeholder: 'Datepicker with navigation',
  },
};

export const WithButtonBar: Story = {
  args: {
    showButtonBar: true,
    placeholder: 'With today/clear buttons',
  },
};

export const WithClear: Story = {
  args: {
    showClear: true,
    value: new Date(2025, 0, 15),
    placeholder: 'With clear button',
  },
};

export const Inline: Story = {
  args: {
    inline: true,
    value: new Date(2025, 0, 15),
  },
};

export const TouchUI: Story = {
  args: {
    touchUI: true,
    placeholder: 'Touch-friendly UI',
  },
};

export const MultipleMonths: Story = {
  args: {
    numberOfMonths: 2,
    placeholder: 'Two months displayed',
  },
};

export const MonthView: Story = {
  args: {
    view: 'month',
    placeholder: 'Month view',
  },
};

export const YearView: Story = {
  args: {
    view: 'year',
    placeholder: 'Year view',
  },
};

export const WithWeekNumbers: Story = {
  args: {
    showWeek: true,
    placeholder: 'With week numbers',
  },
};

export const CustomFirstDayOfWeek: Story = {
  args: {
    firstDayOfWeek: 1, // Monday
    placeholder: 'Monday as first day',
  },
};

export const CustomDateFormat: Story = {
  args: {
    dateFormat: 'dd/mm/yy',
    placeholder: 'DD/MM/YY format',
  },
};

export const LongDateFormat: Story = {
  args: {
    dateFormat: 'DD, MM dd, yy',
    placeholder: 'Long date format',
  },
};

export const NoIcon: Story = {
  args: {
    showIcon: false,
    placeholder: 'No calendar icon',
  },
};

export const IconAsButton: Story = {
  args: {
    iconDisplay: 'button',
    placeholder: 'Icon as button',
  },
};

export const Fluid: Story = {
  args: {
    fluid: true,
    placeholder: 'Full width datepicker',
  },
};

export const CustomYearRange: Story = {
  args: {
    placeholder: 'Datepicker',
  },
};

export const WithStepValues: Story = {
  args: {
    showTime: true,
    stepHour: 2,
    stepMinute: 15,
    stepSecond: 10,
    placeholder: 'Custom time steps',
  },
};

export const ShowOtherMonths: Story = {
  args: {
    showOtherMonths: true,
    selectOtherMonths: true,
    placeholder: 'Show and select other months',
  },
};

export const ComplexExample: Story = {
  args: {
    selectionMode: 'range',
    showTime: true,
    hourFormat: '24',
    showButtonBar: true,
    showClear: true,
    minDate: new Date(2025, 0, 1),
    maxDate: new Date(2025, 11, 31),
    placeholder: 'Complex date range picker',
  },
};

