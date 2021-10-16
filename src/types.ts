import { GitHub } from '@actions/github/lib/utils';

export type Octokit = InstanceType<typeof GitHub>;

export interface WorkflowSummary {
  name: string;
  initiatedBy: string;
  result: 'success' | 'failure';
  jobs: Job[];
}

export interface Job {
  name: string;
  result: JobResult;
}

export type JobResult = 'success' | 'skipped' | 'failure';

export interface SummaryEmojis {
  success: string;
  skipped: string;
  failure: string;
}
