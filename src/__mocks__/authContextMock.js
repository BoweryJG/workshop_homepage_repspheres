// Mock for AuthContext
export const mockAuthContext = {
  user: null,
  loading: false,
  signInWithGoogle: jest.fn(),
  signOut: jest.fn(),
  isAdmin: false
};

// Mock for useAuth hook
export const mockUseAuth = () => mockAuthContext;
