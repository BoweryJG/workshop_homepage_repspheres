import { mockAuthContext, mockUseAuth } from '../authContextMock';

export const AuthContext = {
  Provider: ({ children }) => children
};

export const useAuth = mockUseAuth;
export const AuthProvider = ({ children }) => children;
