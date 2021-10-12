import ActionsClient from './client';
import WorkflowSummariser from './summariser';
import { Job } from './types';

const MockClient = jest.fn(() => ({
  getCompletedJobs: jest.fn(),
}));
const mockedClient = (new MockClient() as unknown) as ActionsClient;

const WORKFLOW_NAME = 'My workflow';
const RUN_ID = 1234;
const ACTOR = 'username';

const failedJob: Job = {
  name: 'Job 1',
  result: 'failure',
};

const successfulJob: Job = {
  name: 'Job 2',
  result: 'success',
};

const skippedJob: Job = {
  name: 'Job 3',
  result: 'skipped',
};

const completedJobs: Job[] = [failedJob, successfulJob, skippedJob];

describe('WorkflowSummariser', () => {
  const summariser = new WorkflowSummariser(mockedClient);
  beforeEach(() => {
    (mockedClient.getCompletedJobs as jest.Mock).mockReturnValue(completedJobs);
  });

  it('sets name of workflow', async () => {
    const { name } = await summariser.summariseWorkflow(WORKFLOW_NAME, RUN_ID, ACTOR);
    expect(name).toEqual(WORKFLOW_NAME);
  });

  it('sets actor', async () => {
    const { initiatedBy } = await summariser.summariseWorkflow(WORKFLOW_NAME, RUN_ID, ACTOR);
    expect(initiatedBy).toEqual(ACTOR);
  });

  it('fetches and returns jobs', async () => {
    const { jobs } = await summariser.summariseWorkflow(WORKFLOW_NAME, RUN_ID, ACTOR);

    expect(mockedClient.getCompletedJobs).toHaveBeenCalledWith(RUN_ID);
    expect(jobs).toEqual(completedJobs);
  });

  it('summarises job as failed if at least 1 job failed', async () => {
    const { result } = await summariser.summariseWorkflow(WORKFLOW_NAME, RUN_ID, ACTOR);

    expect(result).toEqual('failure');
  });

  it('summarises a job as successful if no jobs failed', async () => {
    (mockedClient.getCompletedJobs as jest.Mock).mockReturnValue([successfulJob, skippedJob]);

    const { result } = await summariser.summariseWorkflow(WORKFLOW_NAME, RUN_ID, ACTOR);

    expect(result).toEqual('success');
  });
});
