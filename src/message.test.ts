import { MessageAttachment } from '@slack/types';
import Message from './message';
import { WorkflowSummary } from './types';

const workflowSummary: WorkflowSummary = {
  name: 'My Workflow',
  initiatedBy: 'lewis',
  result: 'success',
  jobs: [
    {
      name: 'Job 1',
      result: 'success',
    },
    {
      name: 'Job 2',
      result: 'skipped',
    },
    {
      name: 'Job 3',
      result: 'failure',
    },
  ],
};

const expectedMessageAttachment: MessageAttachment = {
  color: '#009933',
  blocks: [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Deployment Success :rocket:',
        emoji: true,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: '*Workflow initiated by*:',
        },
        {
          type: 'image',
          image_url: `https://github.com/lewis.png?size=40`,
          alt_text: `Author's avatar`,
        },
        {
          type: 'plain_text',
          text: 'lewis',
        },
      ],
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Deployment Status*: success',
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Job conclusions for this workflow run*',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ':heavy-check-mark:   Job 1',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ':heavy-minus-sign:   Job 2',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ':heavy-cross-mark:   Job 3',
      },
    },
  ],
};

describe('Message', () => {
  const message = new Message(workflowSummary);

  it('renders the Slack message attachment correctly', () => {
    const actualMessageAttachment = message.render();
    expect(actualMessageAttachment).toEqual(expectedMessageAttachment);
  });
});
