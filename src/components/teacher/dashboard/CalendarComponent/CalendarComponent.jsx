import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // for month/week/day formats
import timeGridPlugin from "@fullcalendar/timegrid"; // for day and week views
import interactionPlugin from "@fullcalendar/interaction"; // for draggable and resizable events
import "./CalendarComponent.css"; // importing the custom styles
import { useThemeContext } from "@/hooks/ThemeContext";

const CalendarComponent = () => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [events, setEvents] = useState([
    { title: "Team Meeting", start: "2024-10-15T10:00:00", end: "2024-10-15T12:00:00" },
    { title: "Project Deadline", start: "2024-10-25", allDay: true },
    { title: "Conference", start: "2024-10-20T09:00:00", end: "2024-10-20T17:00:00" },
  ]);

  const handleDateClick = (info) => {
    alert("Date clicked: " + info.dateStr);
  };

  const handleEventClick = (info) => {
    alert("Event: " + info.event.title);
  };

  return (
    <div
      className="blur_effect_card"
      style={{
        color: isDarkMode ? primaryColor : "#333", // text color based on theme
        padding: "20px",
        maxHeight:"585px",
        overflowY:'auto'
      }}
    >
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
        eventColor={isDarkMode ? "#00adb5" : "#007bff"} // custom event color based on theme
        eventTextColor="#fff" // setting event text color
        // height="500px" // auto height to fit screen
        eventDisplay="block" // block display for better spacing
        themeSystem="standard" // to apply custom theming
        // Adjusting day and grid colors based on dark/light mode
        dayHeaderClassNames={() => (isDarkMode ? "fc-day-header-dark" : "fc-day-header-light")}
        contentHeight="auto"
        views={{
          dayGrid: {
            dayHeaderClassNames: "custom-day-header", // Add custom header class for further customization
          },
        }}
        viewDidMount={(view) => {
          if (view.type === "timeGridWeek") {
            view.el.style.maxHeight = "600px"; // Set max height for week view
            view.el.style.overflowY = "auto"; // Enable scrolling
          }
        }}
      />
    </div>
  );
};

export default CalendarComponent;
