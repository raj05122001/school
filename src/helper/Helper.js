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
  const nameSplit = name?.split(" ");
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
    name: "Subject Training",
    type: "subject",
    image: "/subject.svg",
    key: "subject",
    style: { color: "#99650C", op: 40 },
  },
  {
    name: "Case Study Training",
    type: "case",
    image: "/case.svg",
    key: "case",
    style: { color: "#00562B", op: 50 },
  },
  {
    name: "Q/A Training",
    type: "qa",
    image: "/qa.svg",
    key: "qa",
    style: { color: "#0064CF", op: 10 },
  },
  {
    name: "Workshop Training",
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

export const handleErrorResponse = (error) => {

  const statusCode = error.response ? error.response.status : null;
  const errorMessage = error?.response?.data?.message;

  switch (statusCode) {
    case 400:
      console.error('400 Bad Request :: ', error);
      return {
        audioProcess: {
          status: 'Bad Request',
          errorMessage:
          error?.response?.data?.errors &&
          typeof error.response.data.errors === "object"
            ? Object.values(error?.response?.data?.errors)
            : errorMessage,
        }
      };
    case 403:
      console.error('403 Forbidden :: ', error);
      return {
        audioProcess: {
          status: 'Forbidden',
          errorMessage: errorMessage
        }
      };
    case 404:
      console.error('404 Not found :: ', error);
      return {
        audioProcess: {
          status: 'Not found ',
          errorMessage: errorMessage
        }
      };
    case 422:
      console.error('422 Unprocessable Content  :: ', error);
      return {
        audioProcess: {
          status: 'Unprocessable Content',
          errorMessage: errorMessage
        }
      };
    case 500:
      console.error('500 Internal Server Error :: ', error);
      return {
        audioProcess: {
          status: 'Internal Server Error',
          errorMessage: errorMessage
        }
      }

    case 501:
      console.error('501 Not Implemented :: ', error);
      return {
        audioProcess: {
          status: 'Not Implemented',
          errorMessage: errorMessage
        }
      }

    case 502:
      console.error('502 Bad gateway :: ', error);
      return {
        audioProcess: {
          status: 'Bad gateway',
          errorMessage: errorMessage
        }
      }

    case 503:
      console.error('503 Service Unavailable :: ', error);
      return {
        audioProcess: {
          status: 'Service Unavailable',
          errorMessage: errorMessage
        }
      }


    case 504:
      console.error('504 Gateway Timeout :: ', error);
      return {
        audioProcess: {
          status: 'Gateway Timeout ',
          errorMessage: errorMessage
        }
      }

    case 505:
      console.error('505 HTTP Version Not Supported :: ', error);
      return {
        audioProcess: {
          status: 'HTTP Version Not Supported ',
          errorMessage: errorMessage
        }
      }

    default:
      if (error.code === 'ERR_NETWORK') {
        console.error('Network Error :: ', error);
        return {
          audioProcess: {
            status: 'Network Error',
            errorMessage: 'Could not save and upload your Lecture due to internet connectivity issue. PLEASE DO NOT CLOSE YOUR BROWSER. We will retry uploading the Lecture when connection is restored.'
          }
        }
      } else {
        console.error('Unhandled Error :: ', error);
        return {
          audioProcess: {
            status: 'Unhandled Error',
            errorMessage: ''
          }
        }
      }
  }
};

export const msToHMS = (ms, timeOrDuretion = "time") => {
  // 1- Convert to seconds:
  let seconds = ms / 1000;
  // 2- Extract hours:
  const hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  const minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = (seconds % 60).toFixed(0);
  if (timeOrDuretion === "time") {
    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${hours == 0 ? "" : hours + ":"}${minutes}:${seconds}`;
  } else {
    return `${hours == 0 ? "" : `${hours}h `}${
      minutes == 0 ? "" : `${minutes}m `
    }${seconds == 0 ? "" : `${seconds}s`}`;
  }
};

export const replaceSpeaker = (text) => {
  if (!(text?.match(/^Unidentified ([A-Za-z0-9_]+)(?:,([^@]+@[^,\s]+))?( .+)?$/))) {
    return text?.split(',')[0]
  }
  return text?.split(',')[0]?.replace(/SPEAKER_(\d+)/g, function (match, digits) {
    const numericValue = parseInt(digits, 10);

    if (numericValue >= 0 && numericValue < 24) {
      const replacement = String.fromCharCode('A'.charCodeAt(0) + numericValue);
      return replacement;
    }

    return match;
  });
}