import { render, screen, fireEvent } from '@testing-library/react';
import Calendar from '../../../../app/components/calendar/Calendar';
import { useAuth } from '../../../../app/components/auth/AuthProvider';
import { useEvents } from '../../../../app/lib/hooks/useEvents';

// Mock the hooks
jest.mock('../../../../app/components/auth/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../../app/lib/hooks/useEvents', () => ({
  useEvents: jest.fn(),
}));

describe('Calendar Component', () => {
  const mockUser = { id: 'user123', email: 'test@example.com' };
  const mockSignOut = jest.fn();
  const mockDeleteEvent = jest.fn();
  const mockEvents = [
    {
      id: 'event1',
      user_id: 'user123',
      title: 'Test Event 1',
      description: 'Test Description',
      start_time: '2025-03-23T10:00:00',
      end_time: '2025-03-23T11:00:00',
      created_at: '2025-03-22T10:00:00',
    },
  ];

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
      signOut: mockSignOut,
    });
    
    (useEvents as jest.Mock).mockReturnValue({
      events: mockEvents,
      isLoading: false,
      error: null,
      deleteEvent: mockDeleteEvent,
    });
  });

  it('renders the calendar with correct month', () => {
    render(<Calendar />);
    expect(screen.getByText(/March 2025/i)).toBeInTheDocument();
  });

  it('shows user email when logged in', () => {
    render(<Calendar />);
    expect(screen.getByText(/Welcome, test@example.com/i)).toBeInTheDocument();
  });

  it('navigates to previous month when clicking previous button', () => {
    render(<Calendar />);
    // Get the previous month button (first navigation button)
    const buttons = screen.getAllByRole('button');
    const prevButton = buttons.find(button => 
      button.innerHTML.includes('polyline points="15 18 9 12 15 6"')
    );
    fireEvent.click(prevButton!);
    expect(screen.getByText(/February 2025/i)).toBeInTheDocument();
  });

  it('navigates to next month when clicking next button', () => {
    render(<Calendar />);
    // Get the next month button (second navigation button)
    const buttons = screen.getAllByRole('button');
    const nextButton = buttons.find(button => 
      button.innerHTML.includes('polyline points="9 18 15 12 9 6"')
    );
    fireEvent.click(nextButton!);
    expect(screen.getByText(/April 2025/i)).toBeInTheDocument();
  });

  it('displays events on the calendar', () => {
    render(<Calendar />);
    expect(screen.getByText('Test Event 1')).toBeInTheDocument();
  });

  it('calls signOut when sign out button is clicked', () => {
    render(<Calendar />);
    fireEvent.click(screen.getByText(/Sign Out/i));
    expect(mockSignOut).toHaveBeenCalled();
  });
});
