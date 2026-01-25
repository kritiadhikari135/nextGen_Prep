import apiClient from "./index";

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Add other service properties as needed
}

export interface CreateServiceDto {
  title: string;
  description: string;
  features: string[];
  tools: string[];
  icon: string,
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  duration?: string;
  isActive?: boolean;
  icon?: string;
}

export const serviceApi = {
  // Get all services
  getAll: async () => {
    try {
      const response = await apiClient.get("services");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get service by ID
  getById: async (id: string) => {
    try {
      const response = await apiClient.get(`services/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new service
  create: async (data: CreateServiceDto) => {
    try {
      const response = await apiClient.post("services", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update service
  update: async (id: string, data: UpdateServiceDto) => {
    try {
      const response = await apiClient.put(`services/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete service
  delete: async (id: string) => {
    try {
      const response = await apiClient.delete(`services/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get services by category
  getByCategory: async (category: string) => {
    try {
      const response = await apiClient.get(`services/category/${category}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get active services
  getActive: async () => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        services: Service[];
      }>("services/active");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
