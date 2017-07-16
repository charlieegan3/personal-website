provider "aws" {
  region = "us-east-1"
}

variable "project" {
  default = "charlieegan3-www"
}

variable "domain" {
  default = "charlieegan.com"
}

# Infrastructure State
terraform {
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

# Site content
resource "aws_route53_record" "content" {
  zone_id = "${aws_route53_zone.default.id}"
  name    = "${var.domain}"
  type    = "A"

  alias {
    name                   = "${aws_cloudfront_distribution.content.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.content.hosted_zone_id}"
    evaluate_target_health = false
  }
}

resource "aws_s3_bucket" "content" {
  bucket = "${var.project}-website-content"
  acl    = "public-read"

  policy = <<EOF
{
        "Version": "2008-10-17",
        "Statement": [
                {
                        "Effect": "Allow",
                        "Principal": {
                                "AWS": "*"
                        },
                        "Action": "s3:GetObject",
                        "Resource": "arn:aws:s3:::${var.project}-website-content/*"
                }
        ]
}
  EOF

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

resource "aws_cloudfront_distribution" "content" {
  enabled = true
  aliases = ["${var.domain}"]

  origin {
    domain_name = "${aws_s3_bucket.content.website_endpoint}"
    origin_id   = "${aws_s3_bucket.content.id}"

    custom_origin_config {
      origin_protocol_policy = "http-only"
      http_port              = 80
      https_port             = 443
      origin_ssl_protocols   = ["TLSv1.2", "TLSv1.1", "TLSv1"]
    }
  }

  is_ipv6_enabled = true

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${aws_s3_bucket.content.id}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 18144000

    compress = true
  }

  cache_behavior {
    path_pattern     = "*.js"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${aws_s3_bucket.content.id}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"

    min_ttl     = 18144000
    default_ttl = 18144000
    max_ttl     = 18144000

    compress = true
  }

  cache_behavior {
    path_pattern     = "*.css"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${aws_s3_bucket.content.id}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"

    min_ttl     = 18144000
    default_ttl = 18144000
    max_ttl     = 18144000

    compress = true
  }

  cache_behavior {
    path_pattern     = "*.jpg"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${aws_s3_bucket.content.id}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"

    min_ttl     = 18144000
    default_ttl = 18144000
    max_ttl     = 18144000

    compress = true
  }

  custom_error_response {
    error_code         = "404"
    response_code      = "404"
    response_page_path = "/error.html"
  }

  price_class = "PriceClass_100"

  "restrictions" {
    "geo_restriction" {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = "${data.aws_acm_certificate.default.arn}"

    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }
}

# Redirect www
resource "aws_route53_record" "www-redirect" {
  zone_id = "${aws_route53_zone.default.id}"
  name    = "www.${var.domain}"
  type    = "A"

  alias {
    name                   = "${aws_cloudfront_distribution.www-redirect.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.www-redirect.hosted_zone_id}"
    evaluate_target_health = false
  }
}

resource "aws_s3_bucket" "www-redirect" {
  bucket = "${var.project}-www-redirect"
  acl    = "public-read"

  policy = <<EOF
{
        "Version": "2008-10-17",
        "Statement": [
                {
                        "Effect": "Allow",
                        "Principal": {
                                "AWS": "*"
                        },
                        "Action": "s3:GetObject",
                        "Resource": "arn:aws:s3:::${var.project}-www-redirect/*"
                }
        ]
}
  EOF

  website {
    redirect_all_requests_to = "charlieegan.com"
  }
}

resource "aws_cloudfront_distribution" "www-redirect" {
  enabled = true
  aliases = ["www.${var.domain}"]

  origin {
    domain_name = "${aws_s3_bucket.www-redirect.website_endpoint}"
    origin_id   = "${aws_s3_bucket.www-redirect.id}"

    custom_origin_config {
      origin_protocol_policy = "http-only"
      http_port              = 80
      https_port             = 443
      origin_ssl_protocols   = ["TLSv1.2", "TLSv1.1", "TLSv1"]
    }
  }

  is_ipv6_enabled = true

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${aws_s3_bucket.www-redirect.id}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  price_class = "PriceClass_100"

  "restrictions" {
    "geo_restriction" {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = "${data.aws_acm_certificate.default.arn}"

    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }
}
