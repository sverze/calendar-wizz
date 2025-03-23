"use client";

import { useState } from "react";
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isSameDay, isToday, parseISO, addWeeks, subWeeks, 
  startOfWeek, endOfWeek, addDays, subDays, isSameWeek
} from "date-fns";
import { FiChevronLeft, FiChevronRight, FiPlus, FiLogOut, FiEdit, FiTrash, FiCalendar } from "react-icons/fi";
import { useAuth } from "../auth/AuthProvider";
import EventModal from "./EventModal";
import EventDetailView from "./EventDetailView";
import { Event, useEvents } from "../../lib/hooks/useEvents";
import { cn } from "../../lib/utils";

type CalendarView = 'month' | 'week' | 'day';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [view, setView] = useState<CalendarView>('month');
  const { user, signOut } = useAuth();
  const { events, isLoading, deleteEvent, refreshEvents } = useEvents(user?.id);

  // Date calculations based on current view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Navigation functions for different views
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  
  const nextDay = () => setCurrentDate(addDays(currentDate, 1));
  const prevDay = () => setCurrentDate(subDays(currentDate, 1));
  
  const navigateNext = () => {
    if (view === 'month') nextMonth();
    else if (view === 'week') nextWeek();
    else nextDay();
  };
  
  const navigatePrev = () => {
    if (view === 'month') prevMonth();
    else if (view === 'week') prevWeek();
    else prevDay();
  };

  const handleDateClick = (day: Date) => {
    if (!user) return; // Don't open modal if user is not logged in
    setSelectedDate(day);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleViewEvent = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the day click
    setViewingEvent(event);
    setIsDetailViewOpen(true);
  };

  const handleEditEvent = (event: Event, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent triggering the day click
    setEditingEvent(event);
    setSelectedDate(parseISO(event.start_time));
    setIsDetailViewOpen(false);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (event: Event, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent triggering the day click
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        await deleteEvent(event.id);
        if (isDetailViewOpen) {
          setIsDetailViewOpen(false);
        }
        // Explicitly refresh events after deletion
        refreshEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const getEventsForDay = (day: Date) => {
    if (!events || events.length === 0) return [];
    return events.filter(event => {
      try {
        const eventDate = parseISO(event.start_time);
        return isSameDay(eventDate, day);
      } catch (error) {
        console.error("Error parsing date:", error, event);
        return false;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CalendarWizz</h1>
            {user && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user.email}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
              <button
                onClick={() => setView('month')}
                className={cn(
                  "px-3 py-2 text-sm transition-colors",
                  view === 'month' 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                )}
              >
                Month
              </button>
              <button
                onClick={() => setView('week')}
                className={cn(
                  "px-3 py-2 text-sm transition-colors",
                  view === 'week' 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                )}
              >
                Week
              </button>
              <button
                onClick={() => setView('day')}
                className={cn(
                  "px-3 py-2 text-sm transition-colors",
                  view === 'day' 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                )}
              >
                Day
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <FiPlus /> Add Event
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md transition-colors"
            >
              <FiLogOut /> Sign Out
            </button>
          </div>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {view === 'month' && format(currentDate, "MMMM yyyy")}
              {view === 'week' && `Week of ${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`}
              {view === 'day' && format(currentDate, "EEEE, MMMM d, yyyy")}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={navigatePrev}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiChevronLeft className="text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiCalendar className="text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={navigateNext}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiChevronRight className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Month View */}
          {view === 'month' && (
            <>
              <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="p-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
                {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                  <div
                    key={`empty-start-${index}`}
                    className="bg-gray-50 dark:bg-gray-800 p-4 min-h-[100px]"
                  />
                ))}

                {daysInMonth.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => handleDateClick(day)}
                      className={cn(
                        "bg-white dark:bg-gray-800 p-2 min-h-[100px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                        !isSameMonth(day, currentDate) && "text-gray-400 dark:text-gray-600"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <span
                          className={cn(
                            "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm",
                            isToday(day) &&
                              "bg-blue-600 text-white font-semibold"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            onClick={(e) => handleViewEvent(event, e)}
                            className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 truncate group relative flex justify-between items-center cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800"
                          >
                            <span className="truncate">{event.title}</span>
                            <div className="hidden group-hover:flex space-x-1 absolute right-1 bg-blue-100 dark:bg-blue-900">
                              <button 
                                onClick={(e) => handleEditEvent(event, e)}
                                className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                              >
                                <FiEdit size={12} />
                              </button>
                              <button 
                                onClick={(e) => handleDeleteEvent(event, e)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                              >
                                <FiTrash size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {Array.from({
                  length: 6 - monthEnd.getDay(),
                }).map((_, index) => (
                  <div
                    key={`empty-end-${index}`}
                    className="bg-gray-50 dark:bg-gray-800 p-4 min-h-[100px]"
                  />
                ))}
              </div>
            </>
          )}

          {/* Week View */}
          {view === 'week' && (
            <>
              <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
                {daysInWeek.map((day) => (
                  <div
                    key={day.toISOString()}
                    className="p-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800"
                  >
                    <div>{format(day, "EEE")}</div>
                    <div 
                      className={cn(
                        "mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full",
                        isToday(day) && "bg-blue-600 text-white font-semibold"
                      )}
                    >
                      {format(day, "d")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
                {daysInWeek.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => handleDateClick(day)}
                      className="bg-white dark:bg-gray-800 p-2 min-h-[400px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors overflow-y-auto"
                    >
                      <div className="space-y-1">
                        {dayEvents.map((event) => {
                          const startTime = parseISO(event.start_time);
                          return (
                            <div
                              key={event.id}
                              onClick={(e) => handleViewEvent(event, e)}
                              className="text-xs p-2 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 group relative cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 mb-1"
                            >
                              <div className="font-semibold">{format(startTime, "h:mm a")}</div>
                              <div className="truncate">{event.title}</div>
                              <div className="hidden group-hover:flex space-x-1 absolute top-1 right-1">
                                <button 
                                  onClick={(e) => handleEditEvent(event, e)}
                                  className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                                >
                                  <FiEdit size={12} />
                                </button>
                                <button 
                                  onClick={(e) => handleDeleteEvent(event, e)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                                >
                                  <FiTrash size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Day View */}
          {view === 'day' && (
            <div className="bg-white dark:bg-gray-800 min-h-[600px]">
              <div className="p-4 text-center border-b border-gray-200 dark:border-gray-700">
                <span 
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full text-lg",
                    isToday(currentDate) && "bg-blue-600 text-white font-semibold"
                  )}
                >
                  {format(currentDate, "d")}
                </span>
              </div>
              
              <div 
                className="p-4 cursor-pointer"
                onClick={() => handleDateClick(currentDate)}
              >
                <div className="space-y-2">
                  {getEventsForDay(currentDate).map((event) => {
                    const startTime = parseISO(event.start_time);
                    const endTime = parseISO(event.end_time);
                    return (
                      <div
                        key={event.id}
                        onClick={(e) => handleViewEvent(event, e)}
                        className="p-3 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 group relative cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-sm">
                              {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
                            </div>
                            <div className="font-bold text-base mt-1">{event.title}</div>
                            {event.description && (
                              <div className="text-sm mt-1">{event.description}</div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={(e) => handleEditEvent(event, e)}
                              className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 p-1"
                            >
                              <FiEdit size={16} />
                            </button>
                            <button 
                              onClick={(e) => handleDeleteEvent(event, e)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 p-1"
                            >
                              <FiTrash size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {getEventsForDay(currentDate).length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No events scheduled for today. Click anywhere to add an event.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            // Refresh events when modal is closed
            refreshEvents();
          }}
          selectedDate={selectedDate || new Date()}
          userId={user?.id || ""}
          editEvent={editingEvent}
        />
      )}

      {isDetailViewOpen && viewingEvent && (
        <EventDetailView
          isOpen={isDetailViewOpen}
          onClose={() => {
            setIsDetailViewOpen(false);
            // Refresh events when detail view is closed
            refreshEvents();
          }}
          event={viewingEvent}
          onEdit={() => handleEditEvent(viewingEvent)}
          onDelete={() => handleDeleteEvent(viewingEvent)}
        />
      )}
    </div>
  );
}
