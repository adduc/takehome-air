import { Request, Response } from "express";

import { CreateJobRequest } from "../domain/model/job";
import * as jobService from "../domain/jobService";
import { NotFoundError } from "../errors/NotFoundError";

export async function createJob(req: Request, res: Response) {
  const createJobRequest: CreateJobRequest = req.body;
  const respone = await jobService.createJob(createJobRequest);
  res.status(201).send({
    id: respone.id,
    status: `/jobs/${respone.id}/status`,
  });
}

export async function getStatus(req: Request, res: Response) {
  const jobId = req.params.id;
  jobService.getStatus(jobId).then((jobStatusResponse) => {
    res.status(200).send(jobStatusResponse);
  }).catch((error) => {

    if (error instanceof NotFoundError) {
      res.status(404).send({
        error: error.message,
      });
    } else {
      console.error(error);
      res.status(500).send({
        error: "Internal server error",
      });
    }
  });
}
