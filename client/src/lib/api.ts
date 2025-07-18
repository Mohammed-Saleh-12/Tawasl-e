// Simple API client with credentials
const API_BASE = '/api';

const checkJsonResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    const text = await response.text();
    throw new Error('Server did not return JSON. Response: ' + text);
  }
};

export const apiClient = {
  get: async (url: string) => {
    try {
      const response = await fetch(API_BASE + url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      return checkJsonResponse(response);
    } catch (error) {
      throw error;
    }
  },

  post: async (url: string, data: any) => {
    try {
      const response = await fetch(API_BASE + url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      return checkJsonResponse(response);
    } catch (error) {
      throw error;
    }
  },

  put: async (url: string, data: any) => {
    try {
      const response = await fetch(API_BASE + url, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      return checkJsonResponse(response);
    } catch (error) {
      throw error;
    }
  },

  delete: async (url: string) => {
    try {
      const response = await fetch(API_BASE + url, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      // Handle 204 No Content
      if (response.status === 204) return true;
      return checkJsonResponse(response);
    } catch (error) {
      throw error;
    }
  },
}; 