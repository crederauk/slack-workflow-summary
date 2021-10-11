import { GitHub } from '@actions/github/lib/utils';

export type Octokit = InstanceType<typeof GitHub>;

export interface WorkflowRun {
  name: string;
  result: 'success' | 'failure';
  jobs: Job[];
}

export type JobResult = 'success' | 'skipped' | 'failure';

export interface Job {
  name: string;
  result: JobResult;
}
