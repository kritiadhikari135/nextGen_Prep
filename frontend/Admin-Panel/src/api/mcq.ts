import apiClient from "./index";
import { extractErrorMessage } from "@/lib/error-handler";

export interface McqOptionDto {
  id?: number;
  option_text: string;
  is_correct: boolean;
}

export interface CreateMcqDto {
  question_text: string;
  explanation?: string;
  difficulty?: string;
  options: McqOptionDto[];
}

export interface UpdateMcqDto extends Partial<CreateMcqDto> {}

export const mcqApi = {
  // Create MCQ (topic_id passed as query param)
  create: async (topicId: number, data: CreateMcqDto) => {
    try {
      const response = await apiClient.post(`mcqs?topic_id=${topicId}`, data);
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to create MCQ");
      throw new Error(message);
    }
  },

  // Get MCQs by topic
  getByTopic: async (topicId: number) => {
    try {
      const response = await apiClient.get(`mcqs/${topicId}`);
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to fetch MCQs");
      throw new Error(message);
    }
  },

  // Update MCQ by id
  update: async (mcqId: number, data: UpdateMcqDto) => {
    try {
      const response = await apiClient.patch(`mcqs/${mcqId}`, data);
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to update MCQ");
      throw new Error(message);
    }
  },

  // Delete MCQ
  delete: async (mcqId: number) => {
    try {
      const response = await apiClient.delete(`mcqs/${mcqId}`);
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to delete MCQ");
      throw new Error(message);
    }
  },

  // Bulk upload practice (topic_id + file)
  bulkUploadPractice: async (topicId: number, file: File) => {
    try {
      const fd = new FormData();
      fd.append("topic_id", String(topicId));
      fd.append("file", file);

      const response = await apiClient.post("bulk-upload/practice", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to upload MCQs");
      throw new Error(message);
    }
  },

  // Bulk upload mock test (mock_test_title + file)
  bulkUploadMockTest: async (mockTestTitle: string, file: File) => {
    try {
      const fd = new FormData();
      fd.append("mock_test_title", mockTestTitle);
      fd.append("file", file);

      const response = await apiClient.post("bulk-upload/mock-test", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to upload mock test");
      throw new Error(message);
    }
  },
};
