type Listener = () => void;

interface UiState {
  notificationPanelOpen: boolean;
}

const listeners = new Set<Listener>();
let state: UiState = {
  notificationPanelOpen: false,
};

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeUi(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getUiState() {
  return state;
}

export function setNotificationPanelOpen(open: boolean) {
  state = { ...state, notificationPanelOpen: open };
  emit();
}
