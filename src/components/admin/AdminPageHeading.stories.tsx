import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from '@mui/material';
import AdminPageHeading, { AdminPageHeadingProps } from './AdminPageHeading';

const meta: Meta<typeof AdminPageHeading> = {
  title: 'Admin/AdminPageHeading',
  component: AdminPageHeading,
  parameters: {
    layout: 'padded',
  },
  args: {
    title: 'Заголовок',
  } satisfies Partial<AdminPageHeadingProps>,
};

export default meta;

type Story = StoryObj<typeof AdminPageHeading>;

export const Default: Story = {};

export const WithActions: Story = {
  render: (args) => (
    <AdminPageHeading
      {...args}
      actions={<Button variant="contained">Создать</Button>}
    />
  ),
};
