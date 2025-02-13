import { Job, Status } from "../domain/model/job";

const jobs: Job[] = [];

export function saveJob(job: Job) {
  jobs.push(job);
}

export function getJob(id: string): Promise<Job | undefined> {
  return Promise.resolve(jobs.find((job) => job.id === id));
}

export function getNextPendingJob(): Job | undefined {
  return jobs.find((job) => job.status === Status.pending);
}

export function updateStatus(job: Job, status: Status) {
  job.status = status;
}
