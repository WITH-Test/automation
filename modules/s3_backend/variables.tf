variable "aws_region" {
  type        = string
  description = "The AWS region to put the bucket into"
  default     = "eu-west-3"
}

variable "bucket_prefix" {
  type        = string
  description = "Prefix for the backend bucket"
}

variable "organization" {
  type        = string
  description = "Organization name"
}

variable "environment" {
  type = string
  description = "AWS environment (options: feature, develop, staging, prod)"
}
