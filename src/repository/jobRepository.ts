import { Job, Status } from "../domain/model/job";

import * as jobRepositoryAws from "./jobRepositoryAws";
import * as jobRepositoryMemory from "./jobRepositoryMemory";

const repo = process.env.REPOSITORY === "aws" ? jobRepositoryAws : jobRepositoryMemory;

export async function saveJob(job: Job): Promise<void> {
  return repo.saveJob(job);
}

export async function getJob(id: string): Promise<Job | undefined> {
  return repo.getJob(id);
}

export async function getNextPendingJob(): Promise<Job | undefined> {
  return repo.getNextPendingJob();
}

export async function updateStatus(job: Job, status: Status): Promise<void> {
  return repo.updateStatus(job, status);
}
