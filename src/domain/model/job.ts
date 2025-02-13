export class Destination {
    constructor(public directory: string) { }
}

export class CreateJobRequest {
    constructor(public sourceVideoUrls: string[], public destination: Destination) { }
}

export class CreateJobResponse {
    constructor(public id: string) { }
}

export enum Status {
    pending,
    inProgress,
    done,
    error
}

export class Job {
    constructor(
        public id: string, 
        public sourceVideoUrls: string[], 
        public destination: Destination, 
        public status: Status,

        // job repository specific metadata (e.g. sqs receipt id)
        public metadata?: any,
    ) { }
}

export class GetJobStatusResponse {
    constructor(public status: string) { }
}