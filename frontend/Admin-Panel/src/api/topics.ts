import apiClient from "./index";
import { extractErrorMessage } from "@/lib/error-handler";

export interface Topic {
    id: number;
    name: string;
    subject_id: number;
}

export interface CreateTopicDto {
    name: string;
}

export interface UpdateTopicDto {
    name: string;
}

export const topicsApi = {
    getAll: async () => {
        try {
            const response = await apiClient.get<Topic[]>("/topics");
            return response.data;
        } catch (error) {
            const message = extractErrorMessage(error, "Failed to fetch topics");
            throw new Error(message);
        }
    },

    getBySubject: async (subjectId: number) => {
        try {
            const response = await apiClient.get<Topic[]>("/topics", {
                params: { subject_id: subjectId },
            });
            return response.data;
        } catch (error) {
            const message = extractErrorMessage(error, "Failed to fetch topics");
            throw new Error(message);
        }
    },

    getById: async (topicId: number) => {
        try {
            const response = await apiClient.get<Topic>(`/topics/${topicId}`);
            return response.data;
        } catch (error) {
            const message = extractErrorMessage(error, "Failed to fetch topic");
            throw new Error(message);
        }
    },

    create: async (subjectId: number, data: CreateTopicDto) => {
        try {
            const response = await apiClient.post<Topic>("/topics", data, {
                params: { subject_id: subjectId },
            });
            return response.data;
        } catch (error) {
            const message = extractErrorMessage(error, "Failed to create topic");
            throw new Error(message);
        }
    },

    update: async (topicId: number, data: UpdateTopicDto) => {
        try {
            const response = await apiClient.patch<Topic>(`/topics/${topicId}`, data);
            return response.data;
        } catch (error) {
            const message = extractErrorMessage(error, "Failed to update topic");
            throw new Error(message);
        }
    },

    delete: async (topicId: number) => {
        try {
            await apiClient.delete(`/topics/${topicId}`);
        } catch (error) {
            const message = extractErrorMessage(error, "Failed to delete topic");
            throw new Error(message);
        }
    },
};
