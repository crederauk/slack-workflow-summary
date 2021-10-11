import github from '@actions/github';
import { Job, JobResult, Octokit, WorkflowRun } from './types';

export default class ActionsClient {
  private readonly octokit: Octokit;
  private readonly owner: string;
  private readonly repo: string;

  constructor(token: string, owner: string, repo: string) {
    this.octokit = github.getOctokit(token);
    this.owner = owner;
    this.repo = repo;
  }

  async getWorkflowRun(runId: number): Promise<WorkflowRun> {
    const workflowResponse = await this.octokit.rest.actions.getWorkflowRun({
      owner: this.owner,
      repo: this.repo,
      run_id: runId,
    });
    const jobs = await this.getJobs(runId);

    const { name, conclusion } = workflowResponse.data;
    return {
      name: name as string,
      result: conclusion as 'success' | 'failure',
      jobs,
    };
  }

  async getJobs(runId: number): Promise<Job[]> {
    const response = await this.octokit.rest.actions.listJobsForWorkflowRun({
      owner: this.owner,
      repo: this.repo,
      run_id: runId,
    });
    return response.data.jobs.map((jobData) => ({
      name: jobData.name as string,
      result: jobData.conclusion as JobResult,
    }));
  }
}
