import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventModal from '../../../../app/components/calendar/EventModal';
import { useEvents } from '../../../../app/lib/hooks/useEvents';

// Mock the hooks
jest.mock('../../../../app/lib/hooks/useEvents', () => ({
  useEvents: jest.fn(),
}));

describe('EventModal Component', () => {
  const mockCreateEvent = jest.fn();
  const mockUpdateEvent = jest.fn();
  const mockOnClose = jest.fn();
  const selectedDate = new Date('2025-03-23');
  const userId = 'user123';

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (useEvents as jest.Mock).mockReturnValue({
      createEvent: mockCreateEvent,
      updateEvent: mockUpdateEvent,
    });
  });

  it('renders the add event modal correctly', () => {
    render(
      <EventModal
        isOpen={true}
        onClose={mockOnClose}
        selectedDate={selectedDate}
        userId={userId}
      />
    );
    
    expect(screen.getByText(/Add Event for March 23, 2025/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Time/i)).toBeInTheDocument();
  });

  it('renders the edit event modal correctly with event data', () => {
    const mockEvent = {
      id: 'event1',
      user_id: 'user123',
      title: 'Test Event',
      description: 'Test Description',
      start_time: '2025-03-23T10:00:00',
      end_time: '2025-03-23T11:00:00',
      created_at: '2025-03-22T10:00:00',
    };

    render(
      <EventModal
        isOpen={true}
        onClose={mockOnClose}
        selectedDate={selectedDate}
        userId={userId}
        editEvent={mockEvent}
      />
    );
    
    expect(screen.getByText(/Edit Event for March 23, 2025/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Event')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10:00')).toBeInTheDocument(); // Start time
    expect(screen.getByDisplayValue('11:00')).toBeInTheDocument(); // End time
  });

  it('calls createEvent when submitting a new event', async () => {
    mockCreateEvent.mockResolvedValue({ id: 'new-event-id' });
    
    render(
      <EventModal
        isOpen={true}
        onClose={mockOnClose}
        selectedDate={selectedDate}
        userId={userId}
      />
    );
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'New Test Event' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'New Description' } });
    fireEvent.change(screen.getByLabelText(/Start Time/i), { target: { value: '14:00' } });
    fireEvent.change(screen.getByLabelText(/End Time/i), { target: { value: '15:00' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save Event'));
    
    await waitFor(() => {
      expect(mockCreateEvent).toHaveBeenCalledWith({
        user_id: userId,
        title: 'New Test Event',
        description: 'New Description',
        start_time: '2025-03-23T14:00:00',
        end_time: '2025-03-23T15:00:00',
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('calls updateEvent when editing an existing event', async () => {
    mockUpdateEvent.mockResolvedValue({ id: 'event1' });
    
    const mockEvent = {
      id: 'event1',
      user_id: 'user123',
      title: 'Test Event',
      description: 'Test Description',
      start_time: '2025-03-23T10:00:00',
      end_time: '2025-03-23T11:00:00',
      created_at: '2025-03-22T10:00:00',
    };

    render(
      <EventModal
        isOpen={true}
        onClose={mockOnClose}
        selectedDate={selectedDate}
        userId={userId}
        editEvent={mockEvent}
      />
    );
    
    // Update the form
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Updated Event' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save Event'));
    
    await waitFor(() => {
      expect(mockUpdateEvent).toHaveBeenCalledWith('event1', {
        title: 'Updated Event',
        description: 'Test Description',
        start_time: '2025-03-23T10:00:00',
        end_time: '2025-03-23T11:00:00',
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('closes the modal when cancel is clicked', () => {
    render(
      <EventModal
        isOpen={true}
        onClose={mockOnClose}
        selectedDate={selectedDate}
        userId={userId}
      />
    );
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
