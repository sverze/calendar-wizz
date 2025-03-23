"use client";

import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { format, parseISO } from "date-fns";
import { FiX } from "react-icons/fi";
import { Event, useEvents } from "../../lib/hooks/useEvents";

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  userId: string;
  editEvent?: Event | null;
};

export default function EventModal({
  isOpen,
  onClose,
  selectedDate,
  userId,
  editEvent = null,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createEvent, updateEvent } = useEvents(userId);

  // Initialize form with event data if editing
  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setDescription(editEvent.description || "");
      
      // Extract time from ISO string
      const startDate = parseISO(editEvent.start_time);
      const endDate = parseISO(editEvent.end_time);
      
      setStartTime(format(startDate, "HH:mm"));
      setEndTime(format(endDate, "HH:mm"));
    } else {
      // Reset form for new event
      setTitle("");
      setDescription("");
      setStartTime("09:00");
      setEndTime("10:00");
    }
  }, [editEvent, isOpen]);

  // Validation state
  const [timeError, setTimeError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Validate that end time is after start time
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const startDateTime = `${formattedDate}T${startTime}:00`;
    const endDateTime = `${formattedDate}T${endTime}:00`;
    
    const startDateObj = new Date(startDateTime);
    const endDateObj = new Date(endDateTime);
    
    if (endDateObj <= startDateObj) {
      setTimeError("End time must be after start time");
      return;
    }
    
    setTimeError(null);
    setIsSubmitting(true);

    try {
      if (editEvent) {
        // Update existing event
        await updateEvent(editEvent.id, {
          title,
          description,
          start_time: startDateTime,
          end_time: endDateTime,
        });
      } else {
        // Create new event
        await createEvent({
          user_id: userId,
          title,
          description,
          start_time: startDateTime,
          end_time: endDateTime,
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    {editEvent ? "Edit Event" : "Add Event"} for {format(selectedDate, "MMMM d, yyyy")}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white p-2"
                      placeholder="Event title"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white p-2"
                      placeholder="Event description"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="startTime"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Start Time
                        </label>
                        <input
                          type="time"
                          id="startTime"
                          value={startTime}
                          onChange={(e) => {
                            setStartTime(e.target.value);
                            setTimeError(null); // Clear error when input changes
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white p-2"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="endTime"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          End Time
                        </label>
                        <input
                          type="time"
                          id="endTime"
                          value={endTime}
                          onChange={(e) => {
                            setEndTime(e.target.value);
                            setTimeError(null); // Clear error when input changes
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white p-2"
                          required
                        />
                      </div>
                    </div>
                    
                    {timeError && (
                      <div className="text-red-500 text-sm mt-1">
                        {timeError}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Saving..." : "Save Event"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
