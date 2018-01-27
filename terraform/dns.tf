resource "aws_route53_record" "mail" {
  zone_id = "${aws_route53_zone.default.zone_id}"
  name    = "${var.domain}"
  type    = "MX"
  ttl     = "3600"

  records = [
    "1 ASPMX.L.GOOGLE.COM",
    "5 ALT1.ASPMX.L.GOOGLE.COM",
    "5 ALT2.ASPMX.L.GOOGLE.COM",
    "10 ALT3.ASPMX.L.GOOGLE.COM",
    "10 ALT4.ASPMX.L.GOOGLE.COM",
  ]
}

resource "aws_route53_record" "dkim" {
  zone_id = "${aws_route53_zone.default.zone_id}"
  name    = "google._domainkey"
  type    = "TXT"
  ttl     = "300"

  records = [
    "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCm/xldnDzZCUNYHPDAuUn+MFtHyUT6YwxBfch9FKMO2up7cx8kMzurz9OO+KD+R3DOwSiALVoLwti2dbHZny1gwDfeqrrCvPQtLzuhsOEIAJWKAJFAqsltBxVj4G4NeQF0upAD5wpAlxoshJwRU33DvkQyNEvT8aGhpwYqWcUtFwIDAQAB",
  ]
}

resource "aws_route53_record" "dkim_postmark" {
  zone_id = "${aws_route53_zone.default.zone_id}"
  name    = "20161022200133pm._domainkey"
  type    = "TXT"
  ttl     = "300"

  records = [
    "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3jfeS5Uh/rgG0SWX4SCYhMud9WpyLT/xU7+nceVjIvMyWtzmiG8+OoDvsENi/Mga4PM7VwfFhc6nxmIuhiJ33v9oJ5W21DQzo+kzLLvUIGKELkwLgesnvJLVKmMZSGlfbne04XW5JlgzqYQtjKgqk5yqa/CB4jU9AtKL/7QdTUwIDAQAB",
  ]
}

resource "aws_route53_record" "txt" {
  zone_id = "${aws_route53_zone.default.zone_id}"
  name    = "${var.domain}"
  type    = "TXT"
  ttl     = "300"

  records = [
    "v=spf1 include:_spf.google.com ~all",
    "keybase-site-verification=WxfnZR-p3nQsDqH1_ilKFMGS13-LnMlGPQ3fg3lOWcQ",
    "google-site-verification=cBz1vO6h2fvtz4FMtm27PAqLdkTh1SM0-z-aRo92K-M",
  ]
}

resource "aws_route53_record" "borked" {
  zone_id = "${aws_route53_zone.default.id}"
  name    = "borked.${var.domain}"
  type    = "A"

  alias {
    name                   = "db40xtci7hzh7.cloudfront.net"
    zone_id                = "Z2FDTNDATAQYW2"
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www" {
  zone_id = "${aws_route53_zone.default.id}"
  name    = "serializer.${var.domain}"
  type    = "CNAME"
  ttl     = "300"
  records = ["serializer.charlieegan3.com.herokudns.com"]
}
