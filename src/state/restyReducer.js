// One reducer owns the application-wide state (Phase 4).
export const STORAGE_KEY = 'resty-history-v1';

export const initialState = {
  draft: { method: 'GET', url: '', body: '' },
  request: null,
  requestNumber: 0,
  loading: false,
  response: null,
  error: '',
  history: [],
  hydrated: false,
};

export function restyReducer(state, action) {
  switch (action.type) {
    case 'EDIT_URL':
      return { ...state, draft: { ...state.draft, url: action.value } };
    case 'EDIT_METHOD':
      return { ...state, draft: { ...state.draft, method: action.value } };
    case 'EDIT_BODY':
      return { ...state, draft: { ...state.draft, body: action.value } };
    case 'REQUEST_START': {
      const requestNumber = state.requestNumber + 1;
      return {
        ...state,
        requestNumber,
        request: { ...action.request, id: requestNumber },
        loading: true,
        error: '',
        response: null,
      };
    }
    case 'REQUEST_COMPLETE': {
      if (!state.request || action.id !== state.request.id) return state;
      const entry = {
        id: action.id,
        method: state.request.method,
        url: state.request.url,
        body: state.request.body,
        response: action.response,
        date: new Date().toISOString(),
      };
      return {
        ...state,
        loading: false,
        response: action.response,
        error: action.response.ok ? '' : 'Request returned HTTP ' + action.response.status,
        history: [entry, ...state.history].slice(0, 50),
      };
    }
    case 'REQUEST_FAILED': {
      if (!state.request || action.id !== state.request.id) return state;
      const response = { ok: false, status: null, statusText: 'Network error', headers: {}, data: { error: action.message } };
      const entry = {
        id: action.id,
        method: state.request.method,
        url: state.request.url,
        body: state.request.body,
        response,
        date: new Date().toISOString(),
      };
      return { ...state, loading: false, response, error: action.message, history: [entry, ...state.history].slice(0, 50) };
    }
    case 'FORM_ERROR':
      return { ...state, loading: false, error: action.message, response: null };
    case 'SELECT_HISTORY':
      return { ...state, request: null, loading: false, error: '', response: action.entry.response,
        draft: { method: action.entry.method, url: action.entry.url, body: action.entry.body || '' } };
    case 'HYDRATE_HISTORY':
      return { ...state, history: action.history, hydrated: true };
    case 'CLEAR_HISTORY':
      return { ...state, history: [], response: null, error: '' };
    default:
      return state;
  }
}
