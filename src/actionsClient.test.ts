import * as github from '@actions/github';
import ActionsClient from './actionsClient';
import { Job } from './types';

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
    status: 'completed',
    conclusion: 'failure',
  },
  {
    name: 'Job 2',
    status: 'completed',
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

describe('ActionsClient', () => {
  let client: ActionsClient;
  beforeEach(() => {
    (github.getOctokit as jest.Mock).mockReturnValue(mockOctokit);
    client = new ActionsClient('token', 'owner', 'repo', []);
  });

  describe('getCompletedJobs', () => {
    it('should fetch and return jobs', async () => {
      listJobsForWorkflowRun.mockReturnValue(Promise.resolve({ data: { jobs: mockJobs } }));

      const jobs = await client.getCompletedJobs(1234);

      expect(listJobsForWorkflowRun).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'repo',
        run_id: 1234,
      });
      expect(jobs).toEqual(expectedJobs);
    });

    it('should filter out non-completed jobs', async () => {
      const jobsToReturn = [
        ...mockJobs,
        {
          name: 'In progress',
          conclusion: null,
          status: 'in_progress',
        },
        {
          name: 'Pending',
          conclusion: null,
          status: 'pending',
        },
      ];
      listJobsForWorkflowRun.mockReturnValue(Promise.resolve({ data: { jobs: jobsToReturn } }));

      const jobs = await client.getCompletedJobs(1234);

      expect(listJobsForWorkflowRun).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'repo',
        run_id: 1234,
      });
      expect(jobs).toEqual(expectedJobs);
    });

    it('should filter out excluded jobs', async () => {
      client = new ActionsClient('token', 'owner', 'repo', ['Job 3']);
      const excludedJob = {
        name: 'Job 3',
        result: 'success',
      };
      const jobsToReturn = [
        ...mockJobs,
        {
          name: 'Job 3',
          status: 'completed',
          conclusion: 'success',
        },
      ];
      listJobsForWorkflowRun.mockReturnValue(Promise.resolve({ data: { jobs: jobsToReturn } }));

      const jobs = await client.getCompletedJobs(1234);
      // console.log(jobs)
      expect(jobs).not.toContain(excludedJob);
    });
  });
});
