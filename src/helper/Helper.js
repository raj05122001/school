export function capitalizeWords(str) {
  return str?.replace(/\b\w/g, function (char) {
    return char?.toUpperCase();
  });
}

export const getInitials = (name) => {
  if (!name) {
    return "";
  }
  let initials;
  const nameSplit = name.split(" ");
  const nameLength = nameSplit.length;
  if (nameLength > 1) {
    initials =
      nameSplit[0].substring(0, 1) + nameSplit[nameLength - 1].substring(0, 1);
  } else if (nameLength === 1) {
    initials = nameSplit[0].substring(0, 1);
  } else return;

  return initials.toUpperCase();
};

export function formatTime(timeStr) {
  const date = new Date(`1970-01-01T${timeStr}`);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedHour = formattedHours.toString().padStart(2, "0");

  return `${formattedHour}:${
    formattedMinutes !== "NaN" ? formattedMinutes : "00"
  } ${ampm}`;
}

export const getCurrentMonthYear = () => {
  const date = new Date();
  const month = date.getMonth() + 1; // Months are zero-based, so add 1
  const year = date.getFullYear();
  return [month.toString(), year.toString()];
};

export const LectureTyps = {
  subject: {
    image: "/board_meeting.svg",
    styles: {
      background:
        "linear-gradient(to right, rgba(201,153,65,0.5), rgba(248,235,131,1), rgba(201,153,65,0.5))",
      color: "#99650C",
    },
    name: "Subject",
    style: { bg: "#c99941", text: "#99650C", op: 40 },
  },
  case: {
    image: "/agile_meeting.svg",
    styles: {
      backgroundColor: "rgba(209,255,189,0.5)",
      color: "#00562B",
    },
    name: "Case Study",
    style: { bg: "#d1ffbd", text: "#00562B", op: 50 },
  },
  qa: {
    image: "/customer_meeting.svg",
    styles: {
      backgroundColor: "rgba(0,100,207,0.1)",
      color: "#0064CF",
    },
    name: "Q/A Session",
    style: { bg: "#0064CF", text: "#0064CF", op: 10 },
  },
  workshop: {
    image: "/team_status.svg",
    styles: {
      backgroundColor: "rgba(227,76,0,0.1)",
      color: "#E34C00",
    },
    name: "Workshop",
    style: { bg: "#E34C00", text: "#E34C00", op: 10 },
  },
  quiz: {
    image: "/sales_meeting.svg",
    styles: {
      backgroundColor: "rgba(222,0,0,0.1)",
      color: "#DE0000",
    },
    name: "Quiz Session",
    style: { bg: "#DE0000", text: "#DE0000", op: 10 },
  },
  instant: {
    image: "/instant.png",
    styles: {
      backgroundColor: "rgba(112,26,117,0.1)",
      color: "#701a75",
    },
    name: "Instant",
    style: { bg: "#701a75", text: "#701a75", op: 10 },
  },
};
