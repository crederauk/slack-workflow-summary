import * as github from '@actions/github';
import ActionsClient from './client';
import { Job, WorkflowRun } from './types';

jest.mock('@actions/github', () => ({
  getOctokit: jest.fn(),
}));

const listJobsForWorkflowRun = jest.fn();
const getWorkflowRun = jest.fn();

const mockOctokit = {
  rest: {
    actions: {
      listJobsForWorkflowRun,
      getWorkflowRun,
    },
  },
};

const mockJobs = [
  {
    name: 'Job 1',
    conclusion: 'failure',
  },
  {
    name: 'Job 2',
    conclusion: 'success',
  },
];

const expectedJobs: Job[] = [
  {
    name: 'Job 1',
    result: 'failure',
  },
  {
    name: 'Job 2',
    result: 'success',
  },
];

const mockWorkflowRun = {
  name: 'My workflow',
  conclusion: 'success',
};

const expectedWorkflowRun: WorkflowRun = {
  name: 'My workflow',
  result: 'success',
  jobs: expectedJobs,
};

describe('ActionsClient', () => {
  let client: ActionsClient;
  beforeEach(() => {
    (github.getOctokit as jest.Mock).mockReturnValue(mockOctokit);
    client = new ActionsClient('token', 'owner', 'repo');
  });

  describe('getJobs', () => {
    it('should fetch and return jobs', async () => {
      listJobsForWorkflowRun.mockReturnValue(Promise.resolve({ data: { jobs: mockJobs } }));

      const jobs = await client.getJobs(1234);

      expect(listJobsForWorkflowRun).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'repo',
        run_id: 1234,
      });
      expect(jobs).toEqual(expectedJobs);
    });
  });

  describe('getWorkflowRun', () => {
    it('should fetch and return workflow run', async () => {
      listJobsForWorkflowRun.mockReturnValue(Promise.resolve({ data: { jobs: mockJobs } }));
      getWorkflowRun.mockReturnValue(Promise.resolve({ data: mockWorkflowRun }));

      const workflowRun = await client.getWorkflowRun(1234);

      expect(listJobsForWorkflowRun).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'repo',
        run_id: 1234,
      });
      expect(getWorkflowRun).toHaveBeenCalledWith({ owner: 'owner', repo: 'repo', run_id: 1234 });
      expect(workflowRun).toEqual(expectedWorkflowRun);
    });
  });
});
