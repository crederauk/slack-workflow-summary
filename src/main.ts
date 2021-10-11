import core from '@actions/core';
import github from '@actions/github';
import ActionsClient from './client';
import WorkflowSummariser from './summariser';

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github-token');
    const { owner, repo } = github.context.repo;
    const { runId, workflow } = github.context;

    const actionsClient = new ActionsClient(githubToken, owner, repo);
    const workflowSummariser = new WorkflowSummariser(actionsClient);

    const summary = await workflowSummariser.summariseWorkflow(workflow, runId);
    core.info(`${summary.name}: ${summary.result}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
