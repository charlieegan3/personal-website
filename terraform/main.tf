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

resource "aws_cloudfront_distribution" "s3_distribution" {
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

    viewer_protocol_policy = "redirect-to-https"

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
