import apiClient from "./index";

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
            throw error;
        }
    },

    getBySubject: async (subjectId: number) => {
        try {
            const response = await apiClient.get<Topic[]>("/topics", {
                params: { subject_id: subjectId },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (topicId: number) => {
        try {
            const response = await apiClient.get<Topic>(`/topics/${topicId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (subjectId: number, data: CreateTopicDto) => {
        try {
            const response = await apiClient.post<Topic>("/topics", data, {
                params: { subject_id: subjectId },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (topicId: number, data: UpdateTopicDto) => {
        try {
            const response = await apiClient.patch<Topic>(`/topics/${topicId}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (topicId: number) => {
        try {
            await apiClient.delete(`/topics/${topicId}`);
        } catch (error) {
            throw error;
        }
    },
};
