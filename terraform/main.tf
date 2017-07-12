resource "aws_s3_bucket" "state" {
  bucket = "charlieegan3-www-state"
}

data "terraform_remote_state" "www" {
  backend = "s3"

  config {
    bucket = "${aws_s3_bucket.state.id}"
    region = "${aws_s3_bucket.state.region}"
    key    = "terraform.tfstate"
  }
}
