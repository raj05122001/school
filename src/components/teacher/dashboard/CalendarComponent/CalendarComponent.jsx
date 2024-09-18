import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // for month/week/day formats
import timeGridPlugin from "@fullcalendar/timegrid"; // for day and week views
import interactionPlugin from "@fullcalendar/interaction"; // for draggable and resizable events
import "./CalendarComponent.css"; // importing the custom styles

const CalendarComponent = () => {
  const [events, setEvents] = useState([
    { title: "Team Meeting", start: "2024-09-10T10:00:00", end: "2024-09-10T12:00:00" },
    { title: "Project Deadline", start: "2024-09-15", allDay: true },
    { title: "Conference", start: "2024-09-20T09:00:00", end: "2024-09-20T17:00:00" },
  ]);

  const handleDateClick = (info) => {
    alert("Date clicked: " + info.dateStr);
  };

  const handleEventClick = (info) => {
    alert("Event: " + info.event.title);
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        dateClick={handleDateClick} // handle date click
        eventClick={handleEventClick} // handle event click
        editable={true} // enable dragging and resizing
        selectable={true} // allow selecting range
        selectMirror={true}
        dayMaxEvents={true} // limit events per day
        eventColor="#00adb5" // setting a custom event color
        eventTextColor="#fff" // setting event text color
        height="auto" // auto height to fit screen
        eventDisplay="block" // block display for better spacing
      />
    </div>
  );
};

export default CalendarComponent;
