"use client";

import { useRouter } from "next/navigation";
import { FiCalendar, FiClock, FiUsers, FiArrowRight } from "react-icons/fi";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header/Navigation */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FiCalendar className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">CalendarWizz</span>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => router.push('/login')}
              className="px-4 py-2 text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Sign In
            </button>
            <button 
              onClick={() => router.push('/login?view=sign_up')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Simplify Your Schedule with CalendarWizz
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
              The smart way to manage your time. Organize events, set reminders, and stay on top of your schedule.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => router.push('/login?view=sign_up')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors flex items-center justify-center"
              >
                Get Started <FiArrowRight className="ml-2" />
              </button>
              <button 
                onClick={() => router.push('/login')}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-white font-medium rounded-md transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative h-[400px] w-full">
              <div className="absolute top-0 right-0 bg-blue-100 dark:bg-blue-900 rounded-lg p-6 w-[80%] h-[80%] shadow-lg">
                <div className="border-b border-blue-200 dark:border-blue-800 pb-4 mb-4">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Calendar View</h3>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-10 w-10 flex items-center justify-center rounded-full ${
                        i === 14 ? 'bg-blue-600 text-white' : 'text-blue-800 dark:text-blue-200'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose CalendarWizz?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <FiCalendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Multiple Views
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Switch between month, week, and day views to see your schedule exactly how you need it.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <FiClock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Smart Scheduling
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create events with intelligent time validation to prevent scheduling conflicts.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <FiUsers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Personal Account
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your calendar is synced with your account, so you can access it from anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FiCalendar className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">CalendarWizz</span>
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} CalendarWizz. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
