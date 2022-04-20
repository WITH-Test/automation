variable "aws_region" {
  type        = string
  description = "The AWS region to put the bucket into"
  default     = "eu-west-3"
}

variable "client" {
  type        = string
  description = "Client name. Used to prefix the resources' names."
  required    = true
}

variable "project" {
  type        = string
  description = "Project name. Used to prefix the resources' names."
  required    = true
}

variable "repository" {
  type        = string
  description = "ECR repository name"
  required    = true
}

variable "image_tag" {
  type        = string
  description = "Image tag"
  required    = false
  default     = "latest"
}
