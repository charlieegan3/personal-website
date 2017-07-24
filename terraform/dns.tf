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
