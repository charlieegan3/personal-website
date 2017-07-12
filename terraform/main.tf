variable "project" {
  default = "charlieegan3-www"
}

# Infrastructure State
resource "aws_s3_bucket" "state" {
  bucket = "${var.project}-state"
}

data "terraform_remote_state" "www" {
  backend = "s3"

  config {
    bucket = "${aws_s3_bucket.state.id}"
    region = "${aws_s3_bucket.state.region}"
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
