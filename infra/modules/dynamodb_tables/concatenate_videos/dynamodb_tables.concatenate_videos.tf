variable "environment" {
  type = string
}


# create a dynamodb table
resource "aws_dynamodb_table" "this" {
  name         = "${var.environment}-concatenate-videos"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "S"
  }
}
