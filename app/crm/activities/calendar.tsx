"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Activity {
  id: number;
  type: string;
  subject: string;
  due: string;
  owner: string;
  reminder?: string;
  custom?: Record<string, any>;
}

export default function ActivitiesCalendarPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<{ [date: string]: Activity[] }>({});

  useEffect(() => {
    // Load activities from localStorage (simulate backend)
    const stored = localStorage.getItem("activities");
    let acts: Activity[] = [];
    if (stored) {
      acts = JSON.parse(stored);
    } else {
      // fallback to mock data if needed
      acts = [
        { id: 1, type: "Call", subject: "Follow up with John", due: "2024-06-10", owner: "Alice", reminder: "2024-06-10T10:00" },
        { id: 2, type: "Meeting", subject: "Demo for Beta Ltd", due: "2024-06-12", owner: "Bob", reminder: "2024-06-12T15:00" },
      ];
    }
    setActivities(acts);
    // Map activities to dates
    const ev: { [date: string]: Activity[] } = {};
    acts.forEach((a) => {
      const dueDate = a.due ? a.due.split("T")[0] : null;
      const reminderDate = a.reminder ? a.reminder.split("T")[0] : null;
      if (dueDate) {
        if (!ev[dueDate]) ev[dueDate] = [];
        ev[dueDate].push(a);
      }
      if (reminderDate && reminderDate !== dueDate) {
        if (!ev[reminderDate]) ev[reminderDate] = [];
        ev[reminderDate].push(a);
      }
    });
    setEvents(ev);
  }, []);

  const tileContent = ({ date }: { date: Date }) => {
    const key = date.toISOString().split("T")[0];
    if (events[key]) {
      return (
        <div className="mt-1 flex flex-col gap-1">
          {events[key].map((a) => (
            <span key={a.id} className="block w-2 h-2 rounded-full bg-blue-500 mx-auto" />
          ))}
        </div>
      );
    }
    return null;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const selectedKey = selectedDate ? selectedDate.toISOString().split("T")[0] : null;
  const selectedActivities = selectedKey && events[selectedKey] ? events[selectedKey] : [];

  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Activities Calendar</h1>
        <Link href="/crm/activities">
          <Button variant="outline">Back to Activities</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            onClickDay={handleDateClick}
            tileContent={tileContent}
            className="w-full max-w-lg mx-auto"
          />
          {selectedDate && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">
                Activities on {selectedDate.toLocaleDateString()}
              </h2>
              {selectedActivities.length === 0 ? (
                <div className="text-gray-500">No activities.</div>
              ) : (
                <ul className="space-y-2">
                  {selectedActivities.map((a) => (
                    <li key={a.id} className="bg-gray-50 rounded p-3 text-sm flex flex-col gap-1">
                      <span className="font-medium">{a.type}</span> {a.subject}
                      <span className="text-xs text-gray-500">Due: {a.due}</span>
                      {a.reminder && <span className="text-xs text-blue-600">Reminder: {new Date(a.reminder).toLocaleString()}</span>}
                      <span className="text-xs text-gray-400">Owner: {a.owner}</span>
                      <Link href={`/crm/activities/${a.id}`} className="text-blue-500 underline text-xs mt-1">View Details</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 