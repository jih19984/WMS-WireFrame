type Listener = () => void;

interface UiState {
  notificationPanelOpen: boolean;
  sidebarCollapsed: boolean;
}

const listeners = new Set<Listener>();
let state: UiState = {
  notificationPanelOpen: false,
  sidebarCollapsed: false,
};

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeUi(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getUiState() {
  return state;
}

export function setNotificationPanelOpen(open: boolean) {
  state = { ...state, notificationPanelOpen: open };
  emit();
}

export function setSidebarCollapsed(collapsed: boolean) {
  state = { ...state, sidebarCollapsed: collapsed };
  emit();
}

export function toggleSidebarCollapsed() {
  setSidebarCollapsed(!state.sidebarCollapsed);
}
