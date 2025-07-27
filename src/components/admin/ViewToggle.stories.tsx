/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import ViewToggle, { ViewToggleProps } from './ViewToggle';

const meta: Meta<typeof ViewToggle> = {
  title: 'Admin/ViewToggle',
  component: ViewToggle,
  parameters: {
    layout: 'centered',
  },
  args: {
    section: 'storybook',
  } satisfies Partial<ViewToggleProps>,
};

export default meta;

type Story = StoryObj<typeof ViewToggle>;

export const Default: Story = {};

export const Interactive: Story = {
  render: (args) => {
    const [mode, setMode] = useState<'grid' | 'list'>('grid');
    return (
      <>
        <ViewToggle {...args} onChange={setMode} />
        <p style={{ marginTop: 16 }}>Current mode: {mode}</p>
      </>
    );
  },
};
