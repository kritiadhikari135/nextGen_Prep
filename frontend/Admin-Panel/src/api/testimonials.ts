import apiClient from "./index";

export interface Testimonials {
  id: string;
  userId: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  quote:string;
}

export interface CreateTestimonialsDto {
  userId: string;
  company: string;
  name: string;
  role: string;
  image: File;
  rating: number;
  quote: string;
  
}

export interface UpdateTestimonialsDto {
  name?: string;
  comapny?: string;
  role?: string;
  image: File;
  ratings: number;
  quote:string;

  
}

export const testimonialsApi = {
  // Get all testimonials
  getAll: async () => {
    try {
      const response = await apiClient.get("testimonials");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get testimonials by ID
  getById: async (id: string) => {
    try {
      const response = await apiClient.get(`testimonials/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new team member with FormData support
  create: async (data: CreateTestimonialsDto | FormData) => {
    try {
      // If data is not FormData, convert it
      const formData = data instanceof FormData ? data : (() => {
        const fd = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              fd.append(key, value);
            } else if (typeof value === 'boolean') {
              fd.append(key, String(value));
            } else {
              fd.append(key, String(value));
            }
          }
        });
        return fd;
      })();

      const response = await apiClient.post("testimonials", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update team member with FormData support
  update: async (id: string, data: UpdateTestimonialsDto | FormData) => {
    try {
      // If data is not FormData, convert it
      const formData = data instanceof FormData ? data : (() => {
        const fd = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              fd.append(key, value);
            } else if (typeof value === 'boolean') {
              fd.append(key, String(value));
            } else {
              fd.append(key, String(value));
            }
          }
        });
        return fd;
      })();

      const response = await apiClient.put(`testimonials/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete team member
  delete: async (id: string) => {
    try {
      const response = await apiClient.delete(`testimonials/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  

  
  
};