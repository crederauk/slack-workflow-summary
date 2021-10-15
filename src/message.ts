import {
  ContextBlock,
  DividerBlock,
  HeaderBlock,
  MessageAttachment,
  SectionBlock,
} from '@slack/types';
import { JobResult, WorkflowSummary } from './types';

const SUCCESS_HEADER = 'Deployment Success :rocket:';
const FAILURE_HEADER = 'Deployment Failed :rotating_light:';
const DIVIDER_BLOCK: DividerBlock = {
  type: 'divider',
};

const markdownSection: (text: string) => SectionBlock = (text) => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text,
  },
});

const getJobEmoji: (result: JobResult) => string = (result) => {
  switch (result) {
    case 'success':
      return ':heavy-check-mark:';
    case 'failure':
      return ':heavy-cross-mark:';
    case 'skipped':
      return ':heavy-minus-sign:';
  }
};

export default class Message {
  private readonly summary: WorkflowSummary;

  constructor(summary: WorkflowSummary) {
    this.summary = summary;
  }

  render(): MessageAttachment {
    return {
      color: this.summary.result === 'success' ? '#009933' : '#cc0000',
      blocks: [
        this.renderHeader(),
        DIVIDER_BLOCK,
        this.renderContext(),
        markdownSection(`*Deployment Status*: ${this.summary.result}`),
        DIVIDER_BLOCK,
        ...this.renderJobConclusions(),
      ],
    };
  }

  private renderHeader(): HeaderBlock {
    return {
      type: 'header',
      text: {
        type: 'plain_text',
        text: this.summary.result === 'success' ? SUCCESS_HEADER : FAILURE_HEADER,
        emoji: true,
      },
    };
  }

  private renderContext(): ContextBlock {
    return {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: '*Workflow initiated by*:',
        },
        {
          type: 'image',
          image_url: `https://github.com/${this.summary.initiatedBy}.png?size=40`,
          alt_text: `Author's avatar`,
        },
        {
          type: 'plain_text',
          text: this.summary.initiatedBy,
        },
      ],
    };
  }

  private renderJobConclusions(): SectionBlock[] {
    const title = markdownSection('*Job conclusions for this workflow run*');
    const jobConclusions = this.summary.jobs.map((job) =>
      markdownSection(`${getJobEmoji(job.result)}   ${job.name}`),
    );
    return [title, ...jobConclusions];
  }
}
