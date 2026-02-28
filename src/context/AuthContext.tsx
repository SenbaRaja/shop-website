import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';
import * as cognitoAuth from '../services/cognitoAuthService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authenticatedUser = await cognitoAuth.getCurrentUser();
        if (authenticatedUser) {
          // Extract user information from Cognito response
          const userAttributes = await cognitoAuth.getUserAttributes();
          const groups = await cognitoAuth.getUserGroups();
          
          // Determine role from Cognito groups or custom attributes
          const role = determineRole(groups, userAttributes);
          
          const mappedUser: User = {
            id: authenticatedUser.username,
            username: authenticatedUser.username,
            email: userAttributes?.find((attr: any) => attr.Name === 'email')?.Value,
            role: role as 'admin' | 'staff',
            createdAt: new Date(authenticatedUser.userCreateDate),
            attributes: userAttributes,
          };
          
          setUser(mappedUser);
          localStorage.setItem('currentUser', JSON.stringify(mappedUser));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('currentUser');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Determine user role from Cognito groups or custom attributes
   * Expects 'role' attribute in Cognito user attributes or group membership
   */
  const determineRole = (groups: string[], attributes: any[]): string => {
    // Check Cognito groups first
    if (groups && groups.includes('admin')) {
      return 'admin';
    }
    if (groups && groups.includes('staff')) {
      return 'staff';
    }

    // Fallback to custom attribute if available
    const roleAttribute = attributes?.find((attr: any) => attr.Name === 'custom:role');
    if (roleAttribute?.Value) {
      return roleAttribute.Value;
    }

    // Default to staff role
    return 'staff';
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const authenticatedUser = await cognitoAuth.signIn(username, password);
      
      // Get user attributes
      const userAttributes = await cognitoAuth.getUserAttributes();
      const groups = await cognitoAuth.getUserGroups();
      const role = determineRole(groups, userAttributes);

      const mappedUser: User = {
        id: authenticatedUser.username,
        username: authenticatedUser.username,
        email: userAttributes?.find((attr: any) => attr.Name === 'email')?.Value,
        role: role as 'admin' | 'staff',
        createdAt: new Date(authenticatedUser.userCreateDate),
        attributes: userAttributes,
      };

      setUser(mappedUser);
      localStorage.setItem('currentUser', JSON.stringify(mappedUser));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await cognitoAuth.signOut();
      setUser(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear local state even if Cognito sign out fails
      setUser(null);
      localStorage.removeItem('currentUser');
    }
  };

  const hasPermission = (role: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has all permissions
    return user.role === role;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading authentication...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
