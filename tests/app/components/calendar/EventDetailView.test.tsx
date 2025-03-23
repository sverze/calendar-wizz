import { render, screen, fireEvent } from '@testing-library/react';
import EventDetailView from '../../../../app/components/calendar/EventDetailView';

describe('EventDetailView Component', () => {
  const mockEvent = {
    id: 'event1',
    user_id: 'user123',
    title: 'Test Event',
    description: 'Test Description',
    start_time: '2025-03-23T10:00:00',
    end_time: '2025-03-23T11:00:00',
    created_at: '2025-03-22T10:00:00',
  };
  
  const mockOnClose = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it('renders the event details correctly', () => {
    render(
      <EventDetailView
        isOpen={true}
        onClose={mockOnClose}
        event={mockEvent}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/March 23, 2025 10:00 AM - 11:00 AM/i)).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <EventDetailView
        isOpen={true}
        onClose={mockOnClose}
        event={mockEvent}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalled();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <EventDetailView
        isOpen={true}
        onClose={mockOnClose}
        event={mockEvent}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <EventDetailView
        isOpen={true}
        onClose={mockOnClose}
        event={mockEvent}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    // Find the close button by its icon (FiX)
    const closeButton = screen.getAllByRole('button')[0]; // First button is the close button
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
