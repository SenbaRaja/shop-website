# AWS Cognito Authentication Setup Guide

This project uses **AWS Cognito** for user authentication, user management, and role-based access control (RBAC). This guide explains how to set up and configure AWS Cognito for the application.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS Cognito Setup](#aws-cognito-setup)
3. [Configuration](#configuration)
4. [Frontend Integration](#frontend-integration)
5. [User Management](#user-management)
6. [Groups and Roles](#groups-and-roles)
7. [Environment Variables](#environment-variables)
8. [Testing Authentication](#testing-authentication)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- AWS Account with appropriate IAM permissions
- AWS CLI installed and configured
- Node.js and npm installed locally
- Git for version control

---

## AWS Cognito Setup

### Step 1: Create a User Pool

1. Log in to [AWS Console](https://console.aws.amazon.com)
2. Navigate to **Cognito** service
3. Click **Create user pool**
4. Configure the following:

   **Pool Configuration:**
   - **Pool name**: `stockmate-pro-users`
   - **Sign-in options**: Choose "Username" or "Email" (recommended: both)
   - **Multi-factor authentication (MFA)**: Optional (recommended for production)
   - **User account recovery**: Enable email-based recovery

5. Set password requirements:
   - Minimum length: 12 characters
   - Require uppercase, lowercase, numbers, and special characters

6. Click **Create user pool** and note the **User Pool ID** and **Region**

### Step 2: Create an App Client

1. In your User Pool, go to **App integration** → **App clients and analytics**
2. Click **Create app client**
3. Configure:
   - **App client name**: `stockmate-pro-app`
   - **Client secret**: Optional (uncheck if using public client)
   - **Allowed OAuth flows**: Select "USER_PASSWORD_AUTH" and "ALLOW_REFRESH_TOKEN_AUTH"
   - **Allowed OAuth scopes**: `openid`, `email`, `profile`
4. Note the **Client ID**

### Step 3: Create an Identity Pool (Optional, for AWS service access)

1. Navigate to **Cognito** → **Identity Pools**
2. Click **Create new identity pool**
3. Configure:
   - **Pool name**: `stockmate-pro-identity`
   - **Enable access to unauthenticated identities**: Disable (for security)
   - **Authentication providers**: Select your User Pool ID and App Client ID
4. Note the **Identity Pool ID**

### Step 4: Create User Groups (Roles)

1. In your User Pool, go to **Groups** under **User management**
2. Create the following groups:
   - **admin**: For administrators
   - **staff**: For staff members

3. For each group, set appropriate IAM role permissions if needed

---

## Configuration

### Step 1: Initialize Amplify in the Application

The Cognito configuration needs to be initialized before the app starts. Update the configuration in your authentication service:

```typescript
// src/services/cognitoAuthService.ts
import { Amplify, Auth } from 'aws-amplify';

export interface CognitoConfig {
  region: string;
  userPoolId: string;
  clientId: string;
  identityPoolId: string;
  domain: string;
  redirectSignIn: string;
  redirectSignOut: string;
}

export const initializeCognito = (config: CognitoConfig): void => {
  Amplify.configure({
    Auth: {
      region: config.region,
      userPoolId: config.userPoolId,
      userPoolWebClientId: config.clientId,
      identityPoolId: config.identityPoolId,
      domain: config.domain,
      redirectSignIn: config.redirectSignIn,
      redirectSignOut: config.redirectSignOut,
      responseType: 'code',
      authenticationFlowType: 'USER_PASSWORD_AUTH',
    },
  });
};
```

---

## Frontend Integration

### Step 1: Install Dependencies

```bash
npm install aws-amplify @aws-amplify/auth amazon-cognito-identity-js
```

### Step 2: Initialize in App Entry Point

Update your `src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeCognito } from './services/cognitoAuthService'

// Initialize AWS Cognito before rendering the app
initializeCognito({
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
  identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID || '',
  domain: import.meta.env.VITE_COGNITO_DOMAIN || '',
  redirectSignIn: `${window.location.origin}/`,
  redirectSignOut: `${window.location.origin}/login`,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Step 3: Update AuthContext

The `AuthContext` has been updated to use AWS Cognito for authentication:

**Key features:**
- Automatic session persistence
- Async login/logout operations
- Role-based access control using Cognito groups
- User attributes management

---

## User Management

### Creating Users

#### Option 1: Programmatically (Backend)

Use AWS SDK in your backend:

```bash
aws cognito-idp admin-create-user \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --username john.doe \
  --user-attributes Name=email,Value=john@example.com \
  --temporary-password TempPassword123!
```

#### Option 2: AWS Console

1. In Cognito User Pool, go to **Users**
2. Click **Create user**
3. Enter **Username** and **Email**
4. Set temporary password
5. User will be prompted to create a permanent password on first login

#### Option 3: Self-Registration

Users can sign up themselves using the frontend if enabled.

### Assigning Users to Groups

```bash
aws cognito-idp admin-add-user-to-group \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --username john.doe \
  --group-name admin
```

---

## Groups and Roles

### User Groups in Cognito

Groups in AWS Cognito are used to manage user roles and permissions:

1. **admin**: Full access to all features
   - User management
   - Product management
   - Financial reports
   - System settings

2. **staff**: Limited access
   - View products and inventory
   - Process sales
   - View personal sales reports

### Role Determination Logic

The application determines user roles in this order:

1. **Cognito Groups**: Primary source (from Cognito groups membership)
2. **Custom Attributes**: Secondary source (custom:role attribute)
3. **Default**: Falls back to 'staff' role

### Setting Custom Role Attributes

```bash
aws cognito-idp admin-update-user-attributes \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --username john.doe \
  --user-attributes Name=custom:role,Value=admin
```

---

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# AWS Region
VITE_AWS_REGION=us-east-1

# Cognito Configuration
VITE_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_COGNITO_DOMAIN=https://yourdomain.auth.us-east-1.amazoncognito.com
```

### How to Get These Values

1. **VITE_AWS_REGION**: Your AWS region (e.g., us-east-1, eu-west-1)
2. **VITE_COGNITO_USER_POOL_ID**: From Cognito User Pool details
3. **VITE_COGNITO_CLIENT_ID**: From App clients configuration
4. **VITE_COGNITO_IDENTITY_POOL_ID**: From Identity Pool details (if used)
5. **VITE_COGNITO_DOMAIN**: Custom domain or default domain URL

---

## Testing Authentication

### Test Users

Create test users with different roles:

```bash
# Create admin user
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_xxxxxxxxx \
  --username admin@example.com \
  --user-attributes Name=email,Value=admin@example.com \
  --temporary-password AdminTemp123!

# Create staff user
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_xxxxxxxxx \
  --username staff@example.com \
  --user-attributes Name=email,Value=staff@example.com \
  --temporary-password StaffTemp123!

# Add admin user to admin group
aws cognito-idp admin-add-user-to-group \
  --user-pool-id us-east-1_xxxxxxxxx \
  --username admin@example.com \
  --group-name admin

# Add staff user to staff group
aws cognito-idp admin-add-user-to-group \
  --user-pool-id us-east-1_xxxxxxxxx \
  --username staff@example.com \
  --group-name staff
```

### Manual Testing

1. Start the development server: `npm run dev`
2. Navigate to the login page
3. Enter test credentials
4. Verify that the correct dashboard loads based on user role

---

## Troubleshooting

### Common Issues

#### 1. "Invalid client id provided"
- **Cause**: Incorrect or missing `VITE_COGNITO_CLIENT_ID`
- **Solution**: Verify the App Client ID in AWS Cognito console

#### 2. "User is not confirmed and will not be able to reset password"
- **Cause**: User email not verified
- **Solution**: 
  ```bash
  aws cognito-idp admin-confirm-sign-up \
    --user-pool-id <USER_POOL_ID> \
    --username <USERNAME>
  ```

#### 3. "NotAuthorizedException: Incorrect username or password"
- **Cause**: Wrong credentials or user not confirmed
- **Solution**: 
  - Verify username/password
  - Confirm user with AWS CLI command above

#### 4. "Auth configuration is not defined"
- **Cause**: `initializeCognito()` not called before app renders
- **Solution**: Ensure initialization code is in entry point (main.tsx)

### Enable Debug Logging

```typescript
// Add to main.tsx for debugging
import { Logger } from 'aws-amplify';
Logger.LOG_LEVEL = 'DEBUG';
```

### Check User Status

```bash
aws cognito-idp admin-get-user \
  --user-pool-id <USER_POOL_ID> \
  --username <USERNAME>
```

---

## Security Best Practices

1. **Use HTTPS**: Always use HTTPS in production
2. **Secure Tokens**: Never log or expose JWT tokens
3. **MFA**: Enable MFA for admin accounts
4. **Password Policy**: Enforce strong password requirements
5. **Rate Limiting**: Enable account lockout after failed attempts
6. **API Keys**: Rotate AWS credentials regularly
7. **Environment Variables**: Never commit `.env` files with real credentials

---

## Additional Resources

- [AWS Amplify Authentication Documentation](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/)
- [AWS Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pools.html)
- [AWS Cognito Groups](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-user-groups.html)
- [Amazon Cognito Identity JS Documentation](https://github.com/aws-amplify/amplify-js/tree/main/packages/amazon-cognito-identity-js)

---

## Support

For more information or assistance, refer to:
- AWS Cognito Documentation: https://docs.aws.amazon.com/cognito/
- AWS Amplify Documentation: https://docs.amplify.aws/
- Project Repository Issues: Check the GitHub repository for similar issues and solutions
