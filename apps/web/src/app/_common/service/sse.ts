export function createMockSseConnection(onMessage: (message: string) => void) {
  const timer = window.setInterval(() => {
    onMessage("mock-event");
  }, 30000);

  return {
    close() {
      window.clearInterval(timer);
    },
  };
}
