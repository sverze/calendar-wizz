import { render, screen } from '@testing-library/react';
import Login from '../../../app/login/page';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn(),
  }),
}));

// Mock the auth components
jest.mock('../../../app/components/auth/LoginPage', () => {
  return function MockLoginPage() {
    return <div data-testid="login-page">Login Page Component</div>;
  };
});

describe('Login Page', () => {
  it('renders the login page component', () => {
    render(<Login />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});
