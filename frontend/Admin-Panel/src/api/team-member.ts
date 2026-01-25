import apiClient from "./index";

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio: string;
  // Add other team member properties as needed
}

export interface CreateTeamMemberDto {
  userId: string;
  title: string;
  name: string;
  role: string;
  image: File;
  
}

export interface UpdateTeamMemberDto {
  name?: string;
  email?: string;
  role?: string;
  image: File;
  
}

export const teamMemberApi = {
  // Get all team members
  getAll: async () => {
    try {
      const response = await apiClient.get("team-members");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get team member by ID
  getById: async (id: string) => {
    try {
      const response = await apiClient.get(`team-members/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new team member with FormData support
  create: async (data: CreateTeamMemberDto | FormData) => {
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

      const response = await apiClient.post("team-members", formData, {
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
  update: async (id: string, data: UpdateTeamMemberDto | FormData) => {
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

      const response = await apiClient.put(`team-members/${id}`, formData, {
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
      const response = await apiClient.delete(`team-members/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get team members by role
  getByRole: async (role: "admin" | "manager" | "member" | "viewer") => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        teamMembers: TeamMember[];
      }>(`team-members/role/${role}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get team members by department
  getByDepartment: async (department: string) => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        teamMembers: TeamMember[];
      }>(`team-members/department/${department}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get active team members
  getActive: async () => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        teamMembers: TeamMember[];
      }>("team-members/active");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};