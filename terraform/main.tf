variable "project" {
  default = "charlieegan3-www"
}

# Infrastructure State
terraform {
  backend "s3" {
    bucket = "charlieegan3-www-state"
    region = "eu-west-1"
    key    = "terraform.tfstate"
  }
}

# Website
resource "aws_s3_bucket" "www" {
  bucket = "${var.project}-build"
  acl    = "public-read"

  policy = <<EOF
{
    "Statement": [ {
        "Action": [
            "s3:GetObject"
        ],
        "Effect": "Allow",
        "Resource": "arn:aws:s3:::${var.project}-build/*",
        "Principal": {
            "AWS": [ "*" ]
        }
    } ]
}
  EOF

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}
