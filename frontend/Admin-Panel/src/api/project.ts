import apiClient from "./index";

export interface Project {
  id: string;
  name: string;
  description: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  image: string;
  technologies: string[];
  liveLink: string;
}

export interface CreateProjectDto {
  title: string;
  category: string;
  description: string;
  problem: string;
  solution: string;
  image: File;
  technologies: string[];
  liveLink: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  title?: string;
  category?: string;
  problem?: string;
  solution?: string;
  image?: File;
  technologies?: string[];
  liveLink?: string;
}

export const projectApi = {
  // Get all projects
  getAll: async () => {
    try {
      const response = await apiClient.get("projects");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get project by ID
  getById: async (id: string) => {
    try {
      const response = await apiClient.get(`projects/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new project with FormData
  create: async (data: CreateProjectDto | FormData) => {
    try {
      // If data is not FormData, convert it
      const formData = data instanceof FormData ? data : (() => {
        const fd = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              fd.append(key, value);
            } else if (Array.isArray(value)) {
              fd.append(key, JSON.stringify(value));
            } else {
              fd.append(key, String(value));
            }
          }
        });
        return fd;
      })();

      const response = await apiClient.post("projects", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update project with FormData
  update: async (id: string, data: UpdateProjectDto | FormData) => {
    try {
      // If data is not FormData, convert it
      const formData = data instanceof FormData ? data : (() => {
        const fd = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              fd.append(key, value);
            } else if (Array.isArray(value)) {
              fd.append(key, JSON.stringify(value));
            } else {
              fd.append(key, String(value));
            }
          }
        });
        return fd;
      })();

      const response = await apiClient.put(`projects/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete project
  delete: async (id: string) => {
    try {
      const response = await apiClient.delete(`projects/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get projects by status
  getByStatus: async (
    status: "active" | "completed" | "on-hold" | "cancelled"
  ) => {
    try {
      const response = await apiClient.get(`projects/status/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};