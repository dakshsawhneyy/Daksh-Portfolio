output "cloudfront_domain" {
  description = "The CloudFront distribution domain to use in React app"
  value       = aws_cloudfront_distribution.my_cdn.domain_name
}