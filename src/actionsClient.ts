import * as github from '@actions/github';
import { Job, JobResult, Octokit } from './types';

export default class ActionsClient {
  private readonly octokit: Octokit;
  private readonly owner: string;
  private readonly repo: string;
  private readonly excludedJobs: string[];

  constructor(token: string, owner: string, repo: string, excludedJobs: string[]) {
    this.octokit = github.getOctokit(token);
    this.owner = owner;
    this.repo = repo;
    this.excludedJobs = excludedJobs;
  }

  async getCompletedJobs(runId: number): Promise<Job[]> {
    const response = await this.octokit.rest.actions.listJobsForWorkflowRun({
      owner: this.owner,
      repo: this.repo,
      run_id: runId,
    });
    return response.data.jobs
      .filter(({ status }) => status === 'completed')
      .filter(({ name }) => !this.excludedJobs.includes(name))
      .map((jobData) => ({
        name: jobData.name as string,
        result: jobData.conclusion as JobResult,
      }));
  }
}
