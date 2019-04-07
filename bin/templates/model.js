import builder from "./builder";

export const defaultState = {
  loading: false,
  status: null,
  payload: null
};

export default builder("{{ model }}", defaultState, {
  reducer: (state = defaultState, action) => {
    const { type, payload } = action;
    if (type === "{{ model }}.Load") {
      return { ...state, loading: true };
    }
    if (type === "{{ model }}.Loaded") {
      return { ...state, loading: false };
    }
    if (type === "{{ model }}.Success") {
      return { ...state, status: "Success", payload };
    }
    if (type === "{{ model }}.Failure") {
      return { ...state, status: "Failure", payload };
    }
    return state;
  },
  actions: ["Load", "Loaded", "Success", "Failure"],
  apis: {
    fetch: {
      url: "/api/v1/{{ model }}",
      before: ["{{ model }}.Loading"],
      after: ["{{ model }}.Loaded"],
      success: ["{{ model }}.Success"],
      failure: ["{{ model }}.Failure", "notification.Notify"]
    }
  }
});
