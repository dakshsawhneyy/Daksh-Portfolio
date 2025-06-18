# Bucket Creation to Store State file
resource "aws_s3_bucket" "my_bucket" {
    bucket = "daksh-portfolio-bucket-2005"
}

# Locking mechanism using Dynamo DB
resource "aws_dynamodb_table" "terraform_lock" {
    name = "terraform-lock"
    billing_mode = "PAY_PER_REQUEST"
    hash_key = "LockID"
    
    attribute {
        name = "LockID"
        type = "S"
    }
}

# VPC
module "vpc" {
    source  = "terraform-aws-modules/vpc/aws"
    version = "5.21.0"

    name = "eks-vpc"
    cidr = "10.0.0.0/16"

    azs = ["ap-south-1a","ap-south-1b"]
    public_subnets = ["10.0.1.0/24","10.0.2.0/24"]
    private_subnets = ["10.0.3.0/24","10.0.4.0/24"]

    enable_dns_hostnames = true
    enable_nat_gateway = true
    single_nat_gateway = true

    tags = {
        "kubernetes.io/cluster/daksh-portfolio-cluster" = "shared"  # This vpc and its subnets are associated with EKS cluster
    }

    public_subnet_tags = {
        "kubernetes.io/role/elb" = "1" # expose services using LoadBalancer in public subnet
    }

    private_subnet_tags = {
        "kubernetes.io/role/internal-elb" = "1" # expose services like db backend apis in private subnet
    }
}


# Creating Role and Role Policy for EKS
resource "aws_iam_role" "eks_cluster_role" {
    name = "daksh-portfolio-cluster-role"

    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [{
        Effect = "Allow"
        Principal = {
            Service = "eks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
        }]
    })
}

# Attach Role to EKS Cluster
resource "aws_iam_role_policy_attachment" "eks_cluster_attach" {
    role = aws_iam_role.eks_cluster_role.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

# EKS CLuster ### without node group
resource "aws_eks_cluster" "daksh-portfolio" {
    name = "daksh-portfolio-cluster"
    version = "1.30"    # latest version supported by aws
    role_arn = aws_iam_role.eks_cluster_role.arn

    vpc_config {
        subnet_ids = module.vpc.private_subnets
    }

    # Added in last - needed for access of iam user
    access_config {
        authentication_mode = "API_AND_CONFIG_MAP"
    }

    depends_on = [ aws_iam_role_policy_attachment.eks_cluster_attach ]
}

# Creating OIDC
resource "aws_iam_openid_connect_provider" "eks" {
    client_id_list = ["sts.amazonaws.com"]
    thumbprint_list = ["9e99a48a9960b14926bb7f3b02e22da0ecd4e4c2"]  # For ap-south-1
    url = aws_eks_cluster.daksh-portfolio.identity[0].oidc[0].issuer
}

# Creating Node Role
resource "aws_iam_role" "eks_node_role" {
    name = "daksh-portfolio-nodes-role"

    assume_role_policy = jsonencode({
        Version = "2012-10-17",
        Statement = [{
            Effect = "Allow",
            Principal = {
                Service = "ec2.amazonaws.com"
            },
            Action = "sts:AssumeRole"
        }]
    })
}

# Attaching Policies with this role

# Allows the node to register itself with the EKS cluster
resource "aws_iam_role_policy_attachment" "node_AmazonEKSWorkerNodePolicy" {
    role = aws_iam_role.eks_node_role.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

# Grants permission to the CNI plugin (network interface controller).
resource "aws_iam_role_policy_attachment" "node_AmazonEKS_CNI_Policy" {
    role       = aws_iam_role.eks_node_role.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
}

# Required -- Without this error came
resource "aws_iam_role_policy_attachment" "node_AmazonEC2ContainerRegistryReadOnly" {
  role       = aws_iam_role.eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# EBS Policy
resource "aws_iam_role_policy_attachment" "node_AmazonEBSCSIDriverPolicy" {
  role       = aws_iam_role.eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
}

# Creating Node Group
resource "aws_eks_node_group" "node_group" {
    cluster_name = aws_eks_cluster.daksh-portfolio.name
    node_group_name = "daksh-portfolio-node-group"
    node_role_arn = aws_iam_role.eks_node_role.arn
    subnet_ids = module.vpc.private_subnets

    scaling_config {
        desired_size = 2
        max_size = 2
        min_size = 2
    }

    instance_types = ["t3.medium"]
    disk_size = 30

    tags = {
        "Name" = "eks-node-daksh"
    }

    depends_on = [ 
        aws_iam_role_policy_attachment.node_AmazonEKSWorkerNodePolicy,
        aws_iam_role_policy_attachment.node_AmazonEKS_CNI_Policy,
        aws_iam_role_policy_attachment.node_AmazonEC2ContainerRegistryReadOnly,
        aws_iam_role_policy_attachment.node_AmazonEBSCSIDriverPolicy
    ]
}

## Providing Cluster Access to user, so that we can add user iam cred to terminal and interact with cluster
resource "aws_eks_access_entry" "admin_user" {
    cluster_name = aws_eks_cluster.daksh-portfolio.name
    principal_arn = "arn:aws:iam::897722695334:user/dakshsawhneyy"
    type = "STANDARD"
}

resource "aws_eks_access_policy_association" "admin_access" {
    cluster_name = aws_eks_cluster.daksh-portfolio.name
    principal_arn = aws_eks_access_entry.admin_user.principal_arn
    policy_arn = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"

    access_scope {
        type = "cluster"
    }
}