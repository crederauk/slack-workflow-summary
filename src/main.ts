import * as core from '@actions/core';
import * as github from '@actions/github';
import { Block } from '@slack/types';
import ActionsClient from './actionsClient';
import Message from './message';
import SlackClient from './slackClient';
import WorkflowSummariser from './summariser';
import { SummaryEmojis } from './types';

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github-token');
    const webhookUrl = core.getInput('slack-webhook-url');
    const emojis: SummaryEmojis = {
      success: core.getInput('success-emoji'),
      skipped: core.getInput('skipped-emoji'),
      cancelled: core.getInput('cancelled-emoji'),
      failure: core.getInput('failed-emoji'),
    };
    const customBlocks = parseCustomBlocks();
    const { owner, repo } = github.context.repo;
    const { runId, workflow, actor } = github.context;

    const actionsClient = new ActionsClient(githubToken, owner, repo);
    const workflowSummariser = new WorkflowSummariser(actionsClient);
    const client = new SlackClient(webhookUrl);

    const summary = await workflowSummariser.summariseWorkflow(workflow, runId, actor);
    const message = new Message(summary, emojis, customBlocks);

    const result = await client.sendMessage(message);
    core.info(`Sent Slack message: ${result}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

const parseCustomBlocks = () => {
  const customBlocksString = core.getInput('custom-blocks');
  if (customBlocksString === '') {
    return undefined;
  }

  return JSON.parse(customBlocksString) as Block[];
};

run();
