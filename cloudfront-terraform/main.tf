#####################################
# CLOUDFRONT CONFIGURATION
#####################################
resource "aws_cloudfront_distribution" "my_cdn" {
  enabled = true
  is_ipv6_enabled = true
  
  # Where cloudfront will get files from
  origin {
    domain_name = "daksh-portfolio-items.s3.us-east-1.amazonaws.com"
    origin_id = "S3-daksh-portfolio-items"    # Unique ID for using in default cache behaviour

    # CloudFront can read your private buckets -- our bucket is public, no need
    # s3_origin_config { }
  }

  default_cache_behavior {
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = "S3-daksh-portfolio-items"

    viewer_protocol_policy = "redirect-to-https"    # https for security
    
    forwarded_values {
      query_string = false    # ignore query strings for caching (saves cache misses).
      cookies {
        forward = "none"    # Don’t forward cookies to S3 (not needed for static images).
      }
    }

    compress = true     # compress the files to save size
    default_ttl = 86400       # Cache files for 1 day by default.
    max_ttl     = 31536000    # 1 year cache
    min_ttl     = 0
  }

  price_class = "PriceClass_100" # cheapest (NA + Europe)

  restrictions {
    geo_restriction {
      restriction_type = "none"   # No-Geo restrictions. Users can access worldwide
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true   # use cloudfront default certificate -- freee
  }

  tags = {
    Name = "portfolio-image-cdn"
  }
}