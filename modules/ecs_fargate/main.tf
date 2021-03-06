
data "aws_caller_identity" "current" {}


resource "aws_ecs_task_definition" "definition" {
  family                   = "task_definition_name"
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  cpu                      = var.cpu_units
  memory                   = var.memory
  requires_compatibilities = ["FARGATE"]

  container_definitions = <<DEFINITION
[
  {
    "image": "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${var.repository}:${var.image_tag}",
    "name": "${var.client}-${var.project}-container",
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-region" : "${var.aws_region}",
        "awslogs-group" : "stream-to-log-fluentd",
        "awslogs-stream-prefix" : "${var.project}"
      }
    }
  }
]
DEFINITION
}
