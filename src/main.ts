import * as core from '@actions/core';
import * as github from '@actions/github';
import ActionsClient from './client';
import Message from './message';
import SlackClient from './slackClient';
import WorkflowSummariser from './summariser';

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github-token');
    const webhookUrl = core.getInput('slack-webhook-url');
    const { owner, repo } = github.context.repo;
    const { runId, workflow, actor } = github.context;

    const actionsClient = new ActionsClient(githubToken, owner, repo);
    const workflowSummariser = new WorkflowSummariser(actionsClient);
    const client = new SlackClient(webhookUrl);

    const summary = await workflowSummariser.summariseWorkflow(workflow, runId, actor);
    const message = new Message(summary);

    const result = await client.sendMessage(message);
    core.info(`Sent Slack message: ${result}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
