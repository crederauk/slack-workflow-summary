import core from '@actions/core';
import github from '@actions/github';
import ActionsClient from './client';
import Message from './message';
import WorkflowSummariser from './summariser';

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github-token');
    const { owner, repo } = github.context.repo;
    const { runId, workflow, actor } = github.context;

    const actionsClient = new ActionsClient(githubToken, owner, repo);
    const workflowSummariser = new WorkflowSummariser(actionsClient);

    const summary = await workflowSummariser.summariseWorkflow(workflow, runId, actor);
    const message = new Message(summary);
    core.info(JSON.stringify(message.render()));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
