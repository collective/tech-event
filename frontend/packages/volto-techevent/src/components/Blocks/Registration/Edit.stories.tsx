import React from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import config from '@plone/volto/registry';
import Wrapper from '@plone/volto/storybook';
import Edit from './Edit';
import blockInfo from './index';
import { blockEditProps } from '../Sponsors/fixtures';
import { openStatus, registrationStore } from '../../Registration/fixtures';

config.blocks.blocksConfig[blockInfo.id] = blockInfo;

const withWrapper: Decorator = (Story) => (
  <Wrapper anonymous customStore={registrationStore(openStatus)}>
    <div style={{ padding: 24, maxWidth: 720 }}>
      <Story />
    </div>
  </Wrapper>
);

const meta = {
  title: 'Techevent/Registration/Blocks/Registration/Edit',
  component: Edit,
  decorators: [withWrapper],
  tags: ['autodocs'],
} satisfies Meta<typeof Edit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: blockEditProps({
    type: 'eventRegistration',
    data: { title: 'Register for the event' },
  }),
};
