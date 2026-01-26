import apiClient from "./index";
import { extractErrorMessage } from "@/lib/error-handler";

export interface MockTest {
  id: number;
  title: string;
  total_questions: number;
  file_url?: string;
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
      const message = extractErrorMessage(error, "Failed to fetch mock tests");
      throw new Error(message);
    }
  },

  getById: async (mockTestId: number) => {
    try {
      const response = await apiClient.get<MockTest>(`/mock-tests/${mockTestId}`);
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to fetch mock test");
      throw new Error(message);
    }
  },

  create: async (data: CreateMockTestDto, file: File) => {
    try {
      const formData = new FormData();
      formData.append("mock_test_title", data.title);
      formData.append("file", file);

      const response = await apiClient.post<MockTest>(
        "/bulk-upload/mock-test",
        formData
      );
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to create mock test");
      throw new Error(message);
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
      const message = extractErrorMessage(error, "Failed to update mock test");
      throw new Error(message);
    }
  },

  delete: async (mockTestId: number) => {
    try {
      await apiClient.delete(`/mock-tests/${mockTestId}`);
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to delete mock test");
      throw new Error(message);
    }
  },
};
