import { Job, Status } from "../domain/model/job";
import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  GetQueueUrlCommand
} from "@aws-sdk/client-sqs";

import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand
} from "@aws-sdk/client-dynamodb";

const sqs = new SQSClient({});
const QUEUE_NAME = process.env.JOBS_QUEUE_NAME || 'jobs-queue';

const dynamo = new DynamoDBClient({});
const JOBS_TABLE_NAME = process.env.JOBS_TABLE_NAME || 'jobs-table';

async function getQueueUrl(): Promise<string> {
  const command = new GetQueueUrlCommand({ QueueName: QUEUE_NAME });
  const response = await sqs.send(command);
  if (!response.QueueUrl) throw new Error('Queue URL not found');
  return response.QueueUrl;
}

export async function getJob(id: string): Promise<Job | undefined> {

  // fetch job from dynamo
  const command = new GetItemCommand({
    TableName: JOBS_TABLE_NAME,
    Key: {
      id: { S: id }
    }
  });
  const response = await dynamo.send(command);
  if (!response.Item) return undefined;
  return JSON.parse(response.Item.data.S!) as Job;
}

export async function saveJob(job: Job): Promise<void> {
  // save job to dynamo
  const dynamoCommand = new PutItemCommand({
    TableName: JOBS_TABLE_NAME,
    Item: {
      id: { S: job.id },
      data: { S: JSON.stringify(job) }
    }
  });

  const queueUrl = await getQueueUrl();
  const sqsCommand = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(job),
  });

  await Promise.all([dynamo.send(dynamoCommand), sqs.send(sqsCommand)]);
}

export async function getNextPendingJob(): Promise<Job | undefined> {
  const queueUrl = await getQueueUrl();
  const command = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 20, // Long polling
  });

  const response = await sqs.send(command);
  if (!response.Messages || response.Messages.length === 0) {
    return undefined;
  }

  const message = response.Messages[0];
  const job = JSON.parse(message.Body!) as Job;
  job.metadata = {
    receiptHandle: message.ReceiptHandle,
  };

  return job;
}

export async function updateStatus(job: Job, status: Status): Promise<void> {
  const queueUrl = await getQueueUrl();

  let promises: Promise<any>[] = [];

  // update status in dynamo
  const dynamoCommand = new UpdateItemCommand({
    TableName: JOBS_TABLE_NAME,
    Key: { id: { S: job.id } },
    UpdateExpression: 'set jobStatus = :jobStatus',
    ExpressionAttributeValues: { ':jobStatus': { S: status.toString() } }
  });
  promises.push(dynamo.send(dynamoCommand));

  // if status is done, delete the message from the queue
  if (status === Status.done) {
    promises.push(sqs.send(new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: job.metadata.receiptHandle,
    })));
  }

  await Promise.all(promises);
}
