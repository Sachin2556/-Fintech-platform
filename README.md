# -Fintech-platform

  # Fintech Platform Backend

## Overview

This is the backend for the Fintech Platform, built with Node.js and Hasura. It allows users to manage their accounts and perform transactions such as deposits and withdrawals.

## Requirements

- Node.js
- Hasura CLI
- PostgreSQL

## Setup Instructions

### Step 1: Set up PostgreSQL

1. Install PostgreSQL if you haven't already.
2. Create a database for the project.

### Step 2: Configure Hasura

1. Install Hasura CLI:
   ```bash
   curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash

## 2.Initialize a new Hasura project:
   hasura init fintech-platform
   cd fintech-platform

  ## API Endpoints
   ### POST /deposit
      Body: { "userId": 1, "amount": 100 }
      Response: { "data": { ... } }
### POST /withdraw
    Body: { "userId": 1, "amount": 50 }
    Response: { "data": { ... } }
 ### Design Decisions and Assumptions
      . Basic structure for deposit and withdrawal operations.
      . Security considerations such as input validation and authentication are assumed to be added in a real-world scenario.
## Future Improvements
     . Add authentication and authorization.
    . Implement input validation.
    . Improve error handling.
