# @todo implement terraform backend using s3 and dynamo/s3 locking

module "sqs_queue_concatenate_videos" {
  source      = "../../modules/sqs_queues/concatenate_videos"
  environment = "prod"
}

module "dynamodb_table_concatenate_videos" {
  source      = "../../modules/dynamodb_tables/concatenate_videos"
  environment = "prod"
}