export const apiClient = {
  get: async <T,>(data: T) => Promise.resolve({ data }),
  post: async <T,>(data: T) => Promise.resolve({ data }),
  put: async <T,>(data: T) => Promise.resolve({ data }),
  patch: async <T,>(data: T) => Promise.resolve({ data }),
  delete: async <T,>(data: T) => Promise.resolve({ data }),
};
