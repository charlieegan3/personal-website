variable "project" {
  default = "charlieegan3-www"
}

variable "domain" {
  default = "charlieegan.com"
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

resource "aws_cloudfront_distribution" "www" {
  aliases = ["${var.domain}"]

  origin {
    domain_name = "${aws_s3_bucket.www.bucket_domain_name}"
    origin_id   = "${aws_s3_bucket.www.id}"
  }

  enabled         = true
  is_ipv6_enabled = true

  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${aws_s3_bucket.www.id}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400

    compress = true
  }

  custom_error_response {
    error_code         = "404"
    response_code      = "404"
    response_page_path = "/error.html"
  }

  price_class = "PriceClass_200"

  "restrictions" {
    "geo_restriction" {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# DNS
resource "aws_route53_zone" "primary" {
  name = "${var.domain}"
}

resource "aws_route53_record" "alias" {
  zone_id = "${aws_route53_zone.primary.id}"
  name    = "${var.domain}"
  type    = "A"

  alias {
    name                   = "${aws_cloudfront_distribution.www.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.www.hosted_zone_id }"
    evaluate_target_health = false
  }
}
