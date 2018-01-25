provider "aws" {
  region = "us-east-1"
}

variable "project" {
  default = "charlieegan3-www"
}

variable "domain" {
  default = "charlieegan3.com"
}

# Terraform & Terraform state config
terraform {
  required_version = "0.11.2"

  backend "s3" {
    bucket = "charlieegan3-www-terraform-state"
    region = "us-east-1"
    key    = "terraform.tfstate"
  }
}

# Route53 shared zone
resource "aws_route53_zone" "default" {
  name = "${var.domain}"
}

# ACM
data "aws_acm_certificate" "default" {
  domain   = "${var.domain}"
  statuses = ["ISSUED"]
}
