import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./CalendarComponent.css";
import { useThemeContext } from "@/hooks/ThemeContext";
import {
  getUpcommingMeetingByDate,
  getStudentUpcommingMeetingByDate,
  getAllUpcommingByDate
} from "@/api/apiHelper";
import LecturePopover from "./LecturePopover";
import { formatTime } from "@/helper/Helper";
import { Skeleton } from "@mui/material";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";

// Helper to get current month and year
const getCurrentMonthYear = () => {
  const today = new Date();
  const month = today.getMonth() + 1; // Months are 0-indexed in JS
  const year = today.getFullYear();
  return [month.toString(), year.toString()];
};

const CalendarComponent = ({ maxHeight = "585px" }) => {
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const { isDarkMode, primaryColor } = useThemeContext();

  const [currentMonth, setCurrentMonth] = useState(getCurrentMonthYear());
  const [calendarData, setCalendarData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const calendarRef = useRef(null);

  // Today's date string for header
  const todayDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  useEffect(() => {
    fetchData();
  }, [currentMonth]);

  const fetchData = async () => {
    setIsLoading(true);
    let apiResponse = null;
    try {
      if (userDetails?.role === "STUDENT") {
        const response = await getStudentUpcommingMeetingByDate(
          currentMonth[1],
          currentMonth[0]
        );
        apiResponse = response?.data?.data?.data;
      } else if (userDetails?.role === "TEACHER") {
        const response = await getUpcommingMeetingByDate(
          currentMonth[1],
          currentMonth[0]
        );
        apiResponse = response?.data?.data;
      } else {
        const response = await getAllUpcommingByDate(
          currentMonth[1],
          currentMonth[0]
        );
        apiResponse = response?.data?.data;
      }

      const dataCalendar = apiResponse || [];

      const formattedData = dataCalendar?.map((obj) => ({
        ...obj,
        id: obj.id,
        title: obj.title || "Untitled Event",
        date: obj.schedule_date,
        start: obj.schedule_date,
        type: obj.type,
        start_time: obj.start_time,
        organizer: obj.organizer?.name,
      }));
      setCalendarData(formattedData);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const monthStringToNumber = (monthString) => {
    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ];
    return months.indexOf(monthString) + 1;
  };

  const eventContent = (info) => {
    const { schedule_time, end_time, type } = info.event.extendedProps;
    const formattedStartTime = formatTime(schedule_time);
    return <LecturePopover data={info} isOrganizer={true} />;
  };
  
  return (
    <div
      className="blur_effect_card"
      style={{
        color: isDarkMode ? primaryColor : "#333",
        padding: "20px",
        maxHeight: maxHeight,
        overflowY: "auto",
      }}
    >
      {isLoading && <CalendarSkeleton />}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        ref={calendarRef}
        headerToolbar={{
          left:   "todayDate",
          center: "title",
          right:  "dayGridMonth,timeGridWeek,timeGridDay,prev,todayGridDay,next",
        }}
        customButtons={{
          todayGridDay: {
                       text: "Today",
                        click: () => {
                          const api = calendarRef.current.getApi();
                          api.changeView("timeGridDay", new Date());
                        }
                      },
          todayDate: { text: todayDate, click: () => {} },
        }}
        events={calendarData}
        eventContent={eventContent}
        datesSet={(dateInfo) => {
          const viewTitle = dateInfo.view.getCurrentData().viewTitle;
          const [month, year] = viewTitle.split(" ");
          const monthNumber = monthStringToNumber(month);
          setCurrentMonth([monthNumber.toString(), year]);
        }}
      />
    </div>
  );
};

export default CalendarComponent;

export const CalendarSkeleton = () => (
  <div>
    <Skeleton width={100} height={30} className="mb-4" />
    <div className="grid grid-cols-7 gap-2">
      {Array(5).fill().map((_, i) => (
        <Skeleton key={i} height={100} className="rounded" />
      ))}
    </div>
  </div>
);
