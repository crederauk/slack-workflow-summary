import {
  Block,
  ContextBlock,
  DividerBlock,
  HeaderBlock,
  KnownBlock,
  MessageAttachment,
  SectionBlock,
} from '@slack/types';
import { SummaryEmojis, WorkflowSummary } from './types';

const SUCCESS_HEADER = 'Workflow Run Success :rocket:';
const FAILURE_HEADER = 'Workflow Run Failed :rotating_light:';
const DIVIDER_BLOCK: DividerBlock = {
  type: 'divider',
};

type CustomBlock = Block | KnownBlock;

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

const markdownSection: (text: string) => SectionBlock = (text) => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text,
  },
});

export default class Message {
  private readonly summary: WorkflowSummary;
  private readonly emojis: SummaryEmojis;
  private readonly footerBlocks?: CustomBlock[];
  private readonly timestamp: Date;

  constructor(
    summary: WorkflowSummary,
    emojis: SummaryEmojis,
    footerBlocks?: CustomBlock[],
    timestamp?: Date,
  ) {
    this.summary = summary;
    this.emojis = emojis;
    this.footerBlocks = footerBlocks;
    this.timestamp = timestamp ?? new Date();
  }

  render(): MessageAttachment {
    const footer = this.footerBlocks ? [DIVIDER_BLOCK, ...this.footerBlocks] : [];
    return {
      color: this.summary.result === 'success' ? '#009933' : '#cc0000',
      blocks: [
        this.renderHeader(),
        DIVIDER_BLOCK,
        this.renderWorkflowName(),
        this.renderInitiatedBy(),
        markdownSection(
          `*Workflow Run Status*: ${this.emojis[this.summary.result]} ${capitalize(
            this.summary.result,
          )}`,
        ),
        DIVIDER_BLOCK,
        ...this.renderJobConclusions(),
        ...footer,
        DIVIDER_BLOCK,
        this.renderTimestamp(),
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

  private renderWorkflowName(): ContextBlock {
    return {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `*Workflow name*: ${this.summary.name}`,
        },
      ],
    };
  }

  private renderInitiatedBy(): ContextBlock {
    return {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: '*Workflow initiated by*:',
        },
        {
          type: 'image',
          // eslint-disable-next-line camelcase
          image_url: `https://github.com/${this.summary.initiatedBy}.png?size=40`,
          // eslint-disable-next-line camelcase
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
      markdownSection(`${this.emojis[job.result]}  ${job.name}`),
    );
    return [title, ...jobConclusions];
  }

  private renderTimestamp(): ContextBlock {
    const date = this.timestamp.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const time = this.timestamp.toLocaleTimeString('en-US');
    return {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `:airplane_arriving: Posted on ${date} at ${time}`,
        },
      ],
    };
  }
}
