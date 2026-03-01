// Amplify v6 splits modules. Auth must be imported from its own package.
import { Amplify } from 'aws-amplify';
// @aws-amplify/auth-export style changed in v6; import as a namespace
import * as Auth from '@aws-amplify/auth';

/**
 * AWS Cognito Authentication Service
 * Initializes and manages user authentication via AWS Cognito
 */

export interface CognitoConfig {
  region: string;
  userPoolId: string;
  clientId: string;
  identityPoolId: string;
  domain: string;
  redirectSignIn: string;
  redirectSignOut: string;
}

// Initialize Amplify with Cognito configuration
export const initializeCognito = (config: CognitoConfig): void => {
  // region is a top‑level Amplify setting; the AuthConfig type no longer declares it
  Amplify.configure({
    aws_project_region: config.region,
    Auth: {
      userPoolId: config.userPoolId,
      userPoolWebClientId: config.clientId,
      identityPoolId: config.identityPoolId,
      domain: config.domain,
      redirectSignIn: config.redirectSignIn,
      redirectSignOut: config.redirectSignOut,
      responseType: 'code',
      authenticationFlowType: 'USER_PASSWORD_AUTH',
    } as any, // some optional properties may not be fully captured by TS types
  });
};

/**
 * Sign up a new user
 */
export const signUp = async (
  username: string,
  password: string,
  email?: string,
  customAttributes?: Record<string, string>
): Promise<any> => {
  try {
    // Amplify v6 signUp takes an object with `username`, optional `password`,
    // and an `options` bag containing userAttributes.
    const result = await Auth.signUp({
      username,
      password,
      options: {
        userAttributes: {
          email: email || username,
          ...customAttributes,
        },
      },
    });
    return result;
  } catch (error) {
    console.error('Sign up failed:', error);
    throw error;
  }
};

/**
 * Confirm user's email/phone after sign up
 */
export const confirmSignUp = async (
  username: string,
  confirmationCode: string
): Promise<any> => {
  try {
    const result = await Auth.confirmSignUp({ username, confirmationCode });
    return result;
  } catch (error) {
    console.error('Confirm sign up failed:', error);
    throw error;
  }
};

/**
 * Sign in user with username and password
 */
export const signIn = async (
  username: string,
  password: string
): Promise<any> => {
  try {
    const user = await Auth.signIn({ username, password });
    return user;
  } catch (error) {
    console.error('Sign in failed:', error);
    throw error;
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<any> => {
  try {
    // new API method
    const user = await Auth.getCurrentUser();
    return user;
  } catch (error) {
    console.error('Get current user failed:', error);
    return null;
  }
};

/**
 * Get current user's credentials/tokens
 */
export const getCurrentUserCredentials = async (): Promise<any> => {
  try {
    // fetchAuthSession returns a session object containing credentials
    const session: any = await Auth.fetchAuthSession();
    return session?.getCredentials?.();
  } catch (error) {
    console.error('Get credentials failed:', error);
    return null;
  }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
  try {
    await Auth.signOut();
  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
};

/**
 * Sign out globally (from all devices)
 */
export const globalSignOut = async (): Promise<void> => {
  try {
    const user: any = await Auth.getCurrentUser();
    // user object should still support globalSignOut
    await user.globalSignOut();
  } catch (error) {
    console.error('Global sign out failed:', error);
    throw error;
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (username: string): Promise<any> => {
  try {
    // renamed to resetPassword
    const result = await Auth.resetPassword({ username });
    return result;
  } catch (error) {
    console.error('Forgot password failed:', error);
    throw error;
  }
};

/**
 * Complete password reset
 */
export const forgotPasswordSubmit = async (
  username: string,
  confirmationCode: string,
  newPassword: string
): Promise<any> => {
  try {
    // renamed to confirmResetPassword
    const result = await Auth.confirmResetPassword({
      username,
      newPassword,
      confirmationCode,
    });
    return result;
  } catch (error) {
    console.error('Forgot password submit failed:', error);
    throw error;
  }
};

/**
 * Change password for authenticated user
 */
export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<any> => {
  try {
    // user is no longer needed by the new API
    const result = await Auth.updatePassword({ oldPassword, newPassword });
    return result;
  } catch (error) {
    console.error('Change password failed:', error);
    throw error;
  }
};

/**
 * Get user attributes (name, email, custom attributes, etc.)
 */
export const getUserAttributes = async (): Promise<any> => {
  try {
    // fetchUserAttributes does not require the user; it uses the currently authenticated user
    const attributes = await Auth.fetchUserAttributes();
    return attributes;
  } catch (error) {
    console.error('Get user attributes failed:', error);
    return null;
  }
};

/**
 * Update user attributes
 */
export const updateUserAttributes = async (
  attributes: Record<string, string>
): Promise<any> => {
  try {
    const result = await Auth.updateUserAttributes({ userAttributes: attributes });
    return result;
  } catch (error) {
    console.error('Update user attributes failed:', error);
    throw error;
  }
};

/**
 * Get user groups (roles)
 */
export const getUserGroups = async (): Promise<string[]> => {
  try {
    const user: any = await Auth.getCurrentUser();
    const groups = user.signInUserSession?.idToken?.payload['cognito:groups'] || [];
    return groups;
  } catch (error) {
    console.error('Get user groups failed:', error);
    return [];
  }
};

/**
 * Check if user has a specific group/role
 */
export const hasRole = async (role: string): Promise<boolean> => {
  try {
    const groups = await getUserGroups();
    return groups.includes(role);
  } catch (error) {
    console.error('Has role check failed:', error);
    return false;
  }
};

/**
 * Get ID token
 */
export const getIdToken = async (): Promise<string | null> => {
  try {
    const user: any = await Auth.getCurrentUser();
    return user.signInUserSession?.idToken?.jwtToken || null;
  } catch (error) {
    console.error('Get ID token failed:', error);
    return null;
  }
};

/**
 * Get access token
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    const user: any = await Auth.getCurrentUser();
    return user.signInUserSession?.accessToken?.jwtToken || null;
  } catch (error) {
    console.error('Get access token failed:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    await Auth.getCurrentUser();
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Refresh authentication session
 */
export const refreshSession = async (): Promise<any> => {
  try {
    const user: any = await Auth.getCurrentUser();
    const result = await user.refreshSession();
    return result;
  } catch (error) {
    console.error('Refresh session failed:', error);
    throw error;
  }
};
