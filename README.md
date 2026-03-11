# AWS CDK Web Architecture (EC2 + RDS)

This project demonstrates how to deploy a simple web application infrastructure on AWS using **AWS Cloud Development Kit (CDK)**.

The infrastructure consists of a **network stack** and a **server stack**, which together create a highly available architecture with EC2 web servers and an RDS MySQL database.

---

# Architecture Overview

The deployment creates the following infrastructure:

```
Internet
   │
   ▼
Internet Gateway
   │
   ▼
VPC
 ├── Public Subnet (AZ1)
 │     └── EC2 Web Server
 │
 ├── Public Subnet (AZ2)
 │     └── EC2 Web Server
 │
 ├── Private Subnet (AZ1)
 │
 └── Private Subnet (AZ2)
        └── RDS MySQL Database
```

### Key Design Decisions

* **VPC with two availability zones** for high availability
* **Public subnets** host web servers
* **Private subnets** host the database
* **Security groups restrict database access** so only the web servers can connect

---

# Infrastructure Components

## Network Stack

Creates the networking layer:

* VPC
* 2 Availability Zones
* 2 Public Subnets
* 2 Private Subnets
* Internet Gateway
* NAT Gateway
* Route tables

---

## Server Stack

Deploys the application resources:

### EC2 Web Servers

* One EC2 instance per public subnet
* Security group allows **HTTP (port 80)** from anywhere

### RDS MySQL Database

* Hosted inside private subnets
* Security group allows **MySQL (port 3306)** only from the web servers

---

# Prerequisites

Before deploying, install:

* Node.js
* AWS CLI
* AWS CDK

Verify installations:

```
node -v
npm -v
aws --version
cdk --version
```

---

# Install Dependencies

```
npm install
```

---

# Configure AWS Credentials

```
aws configure
```

Provide:

* AWS Access Key
* AWS Secret Key
* Region (example: `us-east-1`)
* Output format (`json`)

---

# Bootstrap CDK (First Time Only)

```
cdk bootstrap
```

This prepares your AWS account for CDK deployments.

---

# Deploy the Infrastructure

```
cdk deploy --all
```

This command deploys:

* NetworkStack
* ServerStack

Deployment typically takes **5–10 minutes**.

---

# Verify Deployment

Check the following in AWS Console:

### VPC

```
VPC → Subnets
```

Expected:

* 2 Public Subnets
* 2 Private Subnets

### EC2

```
EC2 → Instances
```

Expected:

* WebServer0
* WebServer1

### RDS

```
RDS → Databases
```

Expected:

* MySQLDB

---

# Cleanup (Important)

To avoid AWS charges, destroy all resources when finished:

```
cdk destroy --all
```

---

# Repository Structure

```
cdk-web-architecture
├── bin/
│   └── cdk-web-architecture.ts
│
├── lib/
│   ├── network-stack.ts
│   └── server-stack.ts
│
├── package.json
├── tsconfig.json
├── cdk.json
└── README.md
```

---

# Author

Godwill Afolabi
