variable "assets_min_ttl" {
  default = 18144000
}

variable "assets_default_ttl" {
  default = 18144000
}

variable "assets_max_ttl" {
  default = 18144000
}

variable "assets_compress" {
  default = true
}

variable "assets_forwarded_param" {
  default = false
}

variable "assets_forwarded_cookies" {
  default = "none"
}

variable "allowed_methods" {
  default = ["GET", "HEAD", "OPTIONS"]
}

variable "cached_methods" {
  default = ["GET", "HEAD"]
}

variable "viewer_protocol_policy" {
  default = "redirect-to-https"
}

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

  force_destroy = true

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

  tags {
    Use = "content"
  }

  default_cache_behavior {
    allowed_methods  = "${var.allowed_methods}"
    cached_methods   = "${var.cached_methods}"
    target_origin_id = "${aws_s3_bucket.content.id}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "${var.viewer_protocol_policy}"

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 18144000

    compress = true
  }

  cache_behavior {
    path_pattern     = "*.js"
    allowed_methods  = "${var.allowed_methods}"
    cached_methods   = "${var.cached_methods}"
    target_origin_id = "${aws_s3_bucket.content.id}"

    forwarded_values {
      query_string = "${var.assets_forwarded_param}"

      cookies {
        forward = "${var.assets_forwarded_cookies}"
      }
    }

    viewer_protocol_policy = "${var.viewer_protocol_policy}"

    min_ttl     = "${var.assets_min_ttl}"
    default_ttl = "${var.assets_default_ttl}"
    max_ttl     = "${var.assets_max_ttl}"

    compress = "${var.assets_compress}"
  }

  cache_behavior {
    path_pattern     = "*.css"
    allowed_methods  = "${var.allowed_methods}"
    cached_methods   = "${var.cached_methods}"
    target_origin_id = "${aws_s3_bucket.content.id}"

    forwarded_values {
      query_string = "${var.assets_forwarded_param}"

      cookies {
        forward = "${var.assets_forwarded_cookies}"
      }
    }

    viewer_protocol_policy = "${var.viewer_protocol_policy}"

    min_ttl     = "${var.assets_min_ttl}"
    default_ttl = "${var.assets_default_ttl}"
    max_ttl     = "${var.assets_max_ttl}"

    compress = "${var.assets_compress}"
  }

  cache_behavior {
    path_pattern     = "*.jpg"
    allowed_methods  = "${var.allowed_methods}"
    cached_methods   = "${var.cached_methods}"
    target_origin_id = "${aws_s3_bucket.content.id}"

    forwarded_values {
      query_string = "${var.assets_forwarded_param}"

      cookies {
        forward = "${var.assets_forwarded_cookies}"
      }
    }

    viewer_protocol_policy = "${var.viewer_protocol_policy}"

    min_ttl     = "${var.assets_min_ttl}"
    default_ttl = "${var.assets_default_ttl}"
    max_ttl     = "${var.assets_max_ttl}"

    compress = "${var.assets_compress}"
  }

  cache_behavior {
    path_pattern     = "*.png"
    allowed_methods  = "${var.allowed_methods}"
    cached_methods   = "${var.cached_methods}"
    target_origin_id = "${aws_s3_bucket.content.id}"

    forwarded_values {
      query_string = "${var.assets_forwarded_param}"

      cookies {
        forward = "${var.assets_forwarded_cookies}"
      }
    }

    viewer_protocol_policy = "${var.viewer_protocol_policy}"

    min_ttl     = "${var.assets_min_ttl}"
    default_ttl = "${var.assets_default_ttl}"
    max_ttl     = "${var.assets_max_ttl}"

    compress = "${var.assets_compress}"
  }

  cache_behavior {
    path_pattern     = "images/*"
    allowed_methods  = "${var.allowed_methods}"
    cached_methods   = "${var.cached_methods}"
    target_origin_id = "${aws_s3_bucket.content.id}"

    forwarded_values {
      query_string = "${var.assets_forwarded_param}"

      cookies {
        forward = "${var.assets_forwarded_cookies}"
      }
    }

    viewer_protocol_policy = "${var.viewer_protocol_policy}"

    min_ttl     = "${var.assets_min_ttl}"
    default_ttl = "${var.assets_default_ttl}"
    max_ttl     = "${var.assets_max_ttl}"

    compress = "${var.assets_compress}"
  }
}
