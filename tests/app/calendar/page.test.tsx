import { render, screen } from '@testing-library/react';
import CalendarPage from '../../../app/calendar/page';

// Mock the Calendar component
jest.mock('../../../app/components/calendar/Calendar', () => {
  return function MockCalendar() {
    return <div data-testid="calendar-component">Calendar Component</div>;
  };
});

// Mock the AuthProvider hook
jest.mock('../../../app/components/auth/AuthProvider', () => ({
  useAuth: jest.fn().mockReturnValue({
    user: { id: '123', email: 'test@example.com' },
    isLoading: false
  })
}));

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  })
}));

describe('Calendar Page', () => {
  it('renders the calendar component when user is authenticated', () => {
    render(<CalendarPage />);
    expect(screen.getByTestId('calendar-component')).toBeInTheDocument();
  });
});
