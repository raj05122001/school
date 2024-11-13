export const initialState = {
    assignments: [],
    loading: true,
    error: null,
    fileLinks: {},
    submittedAssignments: [],
    snackbar: {
      open: false,
      message: "",
      severity: "info",
    },
  };
  
  export function reducer(state, action) {
    switch (action.type) {
      case "FETCH_START":
        return { ...state, loading: true, error: null };
      case "FETCH_SUCCESS":
        return { ...state, loading: false, assignments: action.payload };
      case "FETCH_ERROR":
        return { ...state, loading: false, error: action.payload };
      case "SET_FILE_LINK":
        return {
          ...state,
          fileLinks: {
            ...state.fileLinks,
            [action.payload.assignmentId]: {
              file: action.payload.file,
              type: action.payload.type,
            },
          },
        };
      case "REMOVE_FILE_LINK":
        const newFileLinks = { ...state.fileLinks };
        delete newFileLinks[action.payload];
        return { ...state, fileLinks: newFileLinks };
      case "SET_SUBMITTED":
        return {
          ...state,
          submittedAssignments: [...state.submittedAssignments, action.payload],
        };
      case "SHOW_SNACKBAR":
        return {
          ...state,
          snackbar: {
            open: true,
            message: action.payload.message,
            severity: action.payload.severity,
          },
        };
      case "SNACKBAR_CLOSE":
        return {
          ...state,
          snackbar: { ...state.snackbar, open: false },
        };
      default:
        return state;
    }
  }
  