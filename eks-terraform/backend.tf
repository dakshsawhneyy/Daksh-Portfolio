terraform {
  backend "s3" {
    bucket = "daksh-portfolio-bucket-2005"
    region = "ap-south-1"
    key = "daksh/terraform.tfstate"
    dynamodb_table = "terraform_lock"
  }
}