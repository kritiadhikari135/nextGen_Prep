import apiClient from "./index";

export interface MockTest {
  id: number;
  title: string;
  total_questions: number;
  file_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMockTestDto {
  title: string;
}

export interface UpdateMockTestDto {
  title: string;
}

export const mockTestsApi = {
  getAll: async () => {
    try {
      const response = await apiClient.get<MockTest[]>("/mock-tests");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (mockTestId: number) => {
    try {
      const response = await apiClient.get<MockTest>(`/mock-tests/${mockTestId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (data: CreateMockTestDto, file: File) => {
    try {
      const formData = new FormData();
      formData.append("mock_test_title", data.title);
      formData.append("file", file);

      const response = await apiClient.post<MockTest>(
        "/bulk-upload/mock-test",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (mockTestId: number, data: UpdateMockTestDto) => {
    try {
      const response = await apiClient.patch<MockTest>(
        `/mock-tests/${mockTestId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (mockTestId: number) => {
    try {
      await apiClient.delete(`/mock-tests/${mockTestId}`);
    } catch (error) {
      throw error;
    }
  },
};
