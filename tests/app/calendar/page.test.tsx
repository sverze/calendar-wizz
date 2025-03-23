import { render, screen } from '@testing-library/react';
import CalendarPage from '../../../app/calendar/page';

// Mock the Calendar component
jest.mock('../../../app/components/calendar/Calendar', () => {
  return function MockCalendar() {
    return <div data-testid="calendar-component">Calendar Component</div>;
  };
});

describe('Calendar Page', () => {
  it('renders the calendar component', () => {
    render(<CalendarPage />);
    expect(screen.getByTestId('calendar-component')).toBeInTheDocument();
  });
});
