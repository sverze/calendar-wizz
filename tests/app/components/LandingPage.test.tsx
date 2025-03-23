import { render, screen, fireEvent } from '@testing-library/react';
import LandingPage from '../../../app/components/LandingPage';
import { useRouter } from 'next/navigation';

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe('LandingPage', () => {
  it('renders the landing page with correct content', () => {
    render(<LandingPage />);
    
    // Check for main heading
    expect(screen.getByText('Simplify Your Schedule with CalendarWizz')).toBeInTheDocument();
    
    // Check for feature sections
    expect(screen.getByText('Multiple Views')).toBeInTheDocument();
    expect(screen.getByText('Smart Scheduling')).toBeInTheDocument();
    expect(screen.getByText('Personal Account')).toBeInTheDocument();
    
    // Check for navigation buttons
    expect(screen.getAllByText('Sign In')[0]).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('navigates to sign up page when "Get Started" is clicked', () => {
    const mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    
    render(<LandingPage />);
    
    const getStartedButton = screen.getByText('Get Started');
    fireEvent.click(getStartedButton);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/login?view=sign_up');
  });

  it('navigates to sign in page when "Sign In" is clicked', () => {
    const mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    
    render(<LandingPage />);
    
    // There are multiple "Sign In" buttons, get the one in the header
    const signInButtons = screen.getAllByText('Sign In');
    fireEvent.click(signInButtons[0]);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });
});
