---
title: "Terraform adventures: Deploy a serverless microservice ~2 mins"
date: 2017-08-10 22:18:40 +0100
featured: 2
thumbnail: /blog/2017-08-10-terraform-lambda-api-gateway/lambda-in-2.png
---

`terraform destroy` has been a game changer for my public cloud toy projects.
Building up a reproduceable config that can brought straight back the next time
you come to work on the project is invaluable.

Quite coincidentally, after my [last
post](/blog/2017/07/16/host-a-static-website-5-minutes) about migrating my
personal site to AWS I found myself grappling with another X minute getting
started tutorial in Terraform. I've had this idea for a web app that scans
websites for broken links that isn't generally terrible and might even be
considered fast. The idea was that the work would be done on Lambda and the
results returned to a largely simple S3 hosted site (now that I know how to do
that!).

This took me a week of evenings and a weekend to get working. The main reason
that it took so long was that I didn't really have any idea what API gateway
even was beforehand. API Gateway also has _a lot_ to configure - which makes it
a little overwhelming to configure - even for the basic case.

![Deploy AWS lambda and API gateway with terraform](/blog/2017-08-10-terraform-lambda-api-gateway/lambda-in-2.png)

## Things I tried

I started out doing my usual trick of copying the Terraform docs. There's an
example on there that appears to cover this very topic - [this
one](https://www.terraform.io/docs/providers/aws/r/api_gateway_integration.html#lambda-integration).
I followed that but found that I my requests weren't getting into the function
at all. This example also doesn't have logging configured so it's hard to work
out exactly what's going wrong.

I also looked [at this
post](https://andydote.co.uk/2017/03/17/terraform-aws-lambda-api-gateway/) but
found that it was missing some config for the integration responses.

I found the [hello-lambda repo](https://github.com/TailorDev/hello-lambda)
useful but in the end opted for a more minimal API gateway config using a
PROXY. I opted to do this since it meant fewer resources to match up for
integration and method responses.

## The Method

Unless you're very familiar with API Gateway this likely isn't going to work
first time. I learned the hard way: set up Cloudwatch for the function and API
gateway before doing anything else.

Note: I'll try and explain all the components in here but my final version's
also here on
[GitHub](https://github.com/charlieegan3/borked/tree/b70ddcd141fe4fd2a8d3cf669f044d55ccbb4a7d/terraform)

This is my Lambda config. It describes a function with an attached policy for
logging to Cloudwatch.

```conf
resource "aws_lambda_function" "lambda" {
  filename         = "../handler.zip"
  function_name    = "${var.project}"
  role             = "${aws_iam_role.lambda.arn}"
  handler          = "handler.Handle"
  runtime          = "python2.7"
  timeout          = "30"
  source_code_hash = "${base64sha256(file("../handler.zip"))}"
  memory_size      = "512"
}

resource "aws_iam_role" "lambda" {
  name = "${var.project}-lambda-role"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy" "logging" {
  name = "${var.project}-lambda-logging-policy"
  role = "${aws_iam_role.lambda.id}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "cloudwatch:*",
        "logs:*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}
```

While we're on the topic of logging I think it's also worth explaining how to
add it to your API Gateway account. **Note** this isn't attached to your
Gateway but rather your 'Gateway Account' - you don't need Gateway resource
yet. (but there is a little extra config to make sure the API Gateway logging
is all setup - this comes later)

```conf
resource "aws_api_gateway_account" "default" {
  cloudwatch_role_arn = "${aws_iam_role.apigw.arn}"
}

resource "aws_iam_role" "apigw" {
  name = "${var.project}-apigw-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "cloudwatch" {
  name = "${var.project}-apigw-cloudwatch-policy"
  role = "${aws_iam_role.apigw.id}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams",
                "logs:PutLogEvents",
                "logs:GetLogEvents",
                "logs:FilterLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}
```

Now for the tricky part - creating the API Gateway. I'll break this down. First
create the Gateway 'REST API':

```conf
resource "aws_api_gateway_rest_api" "default" {
  name        = "${var.project}"
  description = "API for the ${var.project} lambda function"
}
```

Now create a resource for it. This is a resource in the API route sense rather
than the Terraform one.

```conf
resource "aws_api_gateway_resource" "default" {
  rest_api_id = "${aws_api_gateway_rest_api.default.id}"
  parent_id   = "${aws_api_gateway_rest_api.default.root_resource_id}"
  path_part   = "process"
}
```

With a resource and API we can configure the resource with methods and
integrations.  How I understand it, a _Method_ is a type of request into an API
Gateway resource that is matched to an _Integration_. The Integration is
responsible for interacting with the backend - in our case a Lambda function.

Below I create a GET method on our resource that has no authentication. This
backs onto an Integration that POSTs to the function (Lambda functions can only
accept POSTs as a trigger).

I use an AWS_PROXY integration as it seemed to be the easiest way to just pass
the request down the stack.

```conf
resource "aws_api_gateway_method" "default" {
  rest_api_id   = "${aws_api_gateway_rest_api.default.id}"
  resource_id   = "${aws_api_gateway_resource.default.id}"
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "default" {
  rest_api_id             = "${aws_api_gateway_rest_api.default.id}"
  resource_id             = "${aws_api_gateway_resource.default.id}"
  http_method             = "${aws_api_gateway_method.default.http_method}"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.lambda.arn}/invocations"
  integration_http_method = "POST"
}
```

So far all we can do is call the function, we can't get anything back out of
the Gateway. This was the most minimal config I could find to get the responses
back out:

```conf
resource "aws_api_gateway_method_response" "response_method" {
  rest_api_id = "${aws_api_gateway_rest_api.default.id}"
  resource_id = "${aws_api_gateway_resource.default.id}"
  http_method = "${aws_api_gateway_integration.default.http_method}"
  status_code = "200"
}

resource "aws_api_gateway_integration_response" "response_method_integration" {
  rest_api_id = "${aws_api_gateway_rest_api.default.id}"
  resource_id = "${aws_api_gateway_resource.default.id}"
  http_method = "${aws_api_gateway_method_response.response_method.http_method}"
  status_code = "${aws_api_gateway_method_response.response_method.status_code}"
}
```

Next create a 'stage'. Many of the other getting started examples have multiple
stages but this was only supposed to take two minutes so I only have one -
sorry. The stage is going to be attached to the other API Gateway resources and
allows us to avoid some extra resources and stages.

```conf
variable "api_gateway_stage" {
  default = "production"
}
```

Finally we tie our config to a deployed 'stage', exposing it to the world.

```conf
resource "aws_api_gateway_deployment" "default" {
  depends_on  = ["aws_api_gateway_integration.default"]
  rest_api_id = "${aws_api_gateway_rest_api.default.id}"
  stage_name  = "${var.api_gateway_stage}"
}
```

But wait, it's not over yet. This final settings resource is required to enable
API Gateway logging - told you there was an extra bit, this is it:

```conf
resource "aws_api_gateway_method_settings" "default" {
  rest_api_id = "${aws_api_gateway_rest_api.default.id}"
  stage_name  = "${var.api_gateway_stage}"
  method_path = "${aws_api_gateway_resource.default.path_part}/*"

  settings {
    metrics_enabled = true
    logging_level   = "INFO"
  }

  depends_on = ["aws_api_gateway_deployment.default"]
}
```

So far we've creatd the function, setup it's logging and configured a minimal
API Gateway. The final step is to allow the two to communicate. This permission
resource lets that happen.

```conf
resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.lambda.arn}"
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:${var.region}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.default.id}/*/*/*"
}
```

But... that won't work without this Terraform data object to get the current
AWS account info.

```
data "aws_caller_identity" "current" {}
```

As I mentioned before, all the config is in the [project's GitHub
Repo](https://github.com/charlieegan3/borked/tree/b70ddcd141fe4fd2a8d3cf669f044d55ccbb4a7d/terraform)
if you'd rather see it all together.
