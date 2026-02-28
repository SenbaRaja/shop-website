import { Amplify, Auth } from 'aws-amplify';

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
    const result = await Auth.signUp({
      username,
      password,
      attributes: {
        email: email || username,
        ...customAttributes,
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
    const result = await Auth.confirmSignUp(username, confirmationCode);
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
    const user = await Auth.signIn(username, password);
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
    const user = await Auth.currentAuthenticatedUser();
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
    const credentials = await Auth.currentCredentials();
    return credentials;
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
    const user = await Auth.currentAuthenticatedUser();
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
    const result = await Auth.forgotPassword(username);
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
    const result = await Auth.forgotPasswordSubmit(
      username,
      confirmationCode,
      newPassword
    );
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
    const user = await Auth.currentAuthenticatedUser();
    const result = await Auth.changePassword(user, oldPassword, newPassword);
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
    const user = await Auth.currentAuthenticatedUser();
    const attributes = await Auth.userAttributes(user);
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
    const user = await Auth.currentAuthenticatedUser();
    const result = await Auth.updateUserAttributes(user, attributes);
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
    const user = await Auth.currentAuthenticatedUser();
    const groups = user.signInUserSession.idToken.payload['cognito:groups'] || [];
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
    const user = await Auth.currentAuthenticatedUser();
    return user.signInUserSession.idToken.jwtToken;
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
    const user = await Auth.currentAuthenticatedUser();
    return user.signInUserSession.accessToken.jwtToken;
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
    await Auth.currentAuthenticatedUser();
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
    const user = await Auth.currentAuthenticatedUser();
    const result = await user.refreshSession();
    return result;
  } catch (error) {
    console.error('Refresh session failed:', error);
    throw error;
  }
};
