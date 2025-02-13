variable "environment" {
  type        = string
  description = <<-EOT
    The name of the environment (dev, prod, etc.)
  EOT
}

# create an sqs queue
resource "aws_sqs_queue" "concatenate_videos" {
  name = "${var.environment}-concatenate-videos"

  tags = {
    Environment = var.environment
  }
}

# create a dead letter queue
resource "aws_sqs_queue" "concatenate_videos_dead_letter" {
  name = "${var.environment}-concatenate-videos-dead-letter"

  tags = {
    Environment = var.environment
  }
}

# create a redrive policy to hook up the dead letter queue
resource "aws_sqs_queue_redrive_policy" "concatenate_videos_redrive_policy" {
  queue_url = aws_sqs_queue.concatenate_videos.url
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.concatenate_videos_dead_letter.arn

    # number of times the queue will try to deliver a message before
    # sending it to the dead letter queue
    maxReceiveCount = 3
  })
}