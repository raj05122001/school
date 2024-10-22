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
    image: "/subject.svg",
    styles: {
      background:
        "linear-gradient(to right, rgba(201,153,65,0.5), rgba(248,235,131,1), rgba(201,153,65,0.5))",
      color: "#99650C",
    },
    name: "Subject",
    style: { bg: "#c99941", text: "#99650C", op: 40 },
  },
  case: {
    image: "/case.svg",
    styles: {
      backgroundColor: "rgba(209,255,189,0.5)",
      color: "#00562B",
    },
    name: "Case Study",
    style: { bg: "#d1ffbd", text: "#00562B", op: 50 },
  },
  qa: {
    image: "/qa.svg",
    styles: {
      backgroundColor: "rgba(0,100,207,0.1)",
      color: "#0064CF",
    },
    name: "Q/A Session",
    style: { bg: "#0064CF", text: "#0064CF", op: 10 },
  },
  workshop: {
    image: "/workshop.svg",
    styles: {
      backgroundColor: "rgba(227,76,0,0.1)",
      color: "#E34C00",
    },
    name: "Workshop",
    style: { bg: "#E34C00", text: "#E34C00", op: 10 },
  },
  quiz: {
    image: "/quiz.svg",
    styles: {
      backgroundColor: "rgba(222,0,0,0.1)",
      color: "#DE0000",
    },
    name: "Quiz Session",
    style: { bg: "#DE0000", text: "#DE0000", op: 10 },
  },
};

export const lecture_type = [
  {
    name: "Subject Lecture",
    type: "subject",
    image: "/subject.svg",
    key: "subject",
    style: { color: "#99650C", op: 40 },
  },
  {
    name: "Case Study Lecture",
    type: "case",
    image: "/case.svg",
    key: "case",
    style: { color: "#00562B", op: 50 },
  },
  {
    name: "Q/A Session",
    type: "qa",
    image: "/qa.svg",
    key: "qa",
    style: { color: "#0064CF", op: 10 },
  },
  {
    name: "Workshop Lecture",
    type: "workshop",
    image: "/workshop.svg",
    key: "workshop",
    style: { color: "#E34C00", op: 10 },
  },
  {
    name: "Quiz Session",
    type: "quiz",
    image: "/quiz.svg",
    key: "quiz",
    style: { color: "#DE0000", op: 10 },
  },
];
