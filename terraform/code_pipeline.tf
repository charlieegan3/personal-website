variable "github_user" {
  default = "charlieegan3"
}

variable "github_repo" {
  default = "personal-website"
}

variable "github_branch" {
  default = "aws"
}

resource "aws_s3_bucket" "foo" {
  bucket = "charlieegan3-example-codepipeline-artifact"
  acl    = "private"
}

resource "aws_iam_role" "foo" {
  name = "test-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codepipeline.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "codepipeline_policy" {
  name = "codepipeline_policy"
  role = "${aws_iam_role.foo.id}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect":"Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:GetBucketVersioning",
        "s3:PutObject"
      ],
      "Resource": [
        "${aws_s3_bucket.foo.arn}",
        "${aws_s3_bucket.foo.arn}/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codedeploy:CreateDeployment",
        "codedeploy:GetApplicationRevision",
        "codedeploy:GetDeployment",
        "codedeploy:GetDeploymentConfig",
        "codedeploy:RegisterApplicationRevision"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "codebuild:BatchGetBuilds",
        "codebuild:StartBuild"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_codepipeline" "foo" {
  name     = "tf-test-pipeline"
  role_arn = "${aws_iam_role.foo.arn}"

  artifact_store {
    location = "${aws_s3_bucket.foo.bucket}"
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "ThirdParty"
      provider         = "GitHub"
      version          = "1"
      output_artifacts = ["test"]

      configuration {
        Owner  = "${var.github_user}"
        Repo   = "${var.github_repo}"
        Branch = "${var.github_branch}"
      }
    }
  }

  stage {
    name = "Build"

    action {
      name            = "Build"
      category        = "Build"
      owner           = "AWS"
      provider        = "CodeBuild"
      input_artifacts = ["test"]
      version         = "1"

      configuration {
        ProjectName = "${aws_codebuild_project.foo.name}"
      }
    }
  }
}
