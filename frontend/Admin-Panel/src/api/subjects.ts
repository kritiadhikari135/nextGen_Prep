import apiClient from "./index";
import { extractErrorMessage } from "@/lib/error-handler";

export interface Subject {
    id: number;
    name: string;
    description?: string;
}

export interface CreateSubjectDto {
    name: string;
    description?: string;
}

export interface UpdateSubjectDto extends Partial<CreateSubjectDto> { }

export const subjectsApi = {
    getAll: async () => {
        try {
            const response = await apiClient.get<Subject[]>("/subjects");
            return response.data;
        } catch (error) {
            const message = extractErrorMessage(error, "Failed to fetch subjects");
            throw new Error(message);
        }
    },

    getById: async (id: number) => {
        try {
            const response = await apiClient.get<Subject>(`/subjects/${id}`);
            return response.data;
        } catch (error) {
            const message = extractErrorMessage(error, "Failed to fetch subject");
            throw new Error(message);
        }
    },

    create: async (data: CreateSubjectDto) => {
        try {
            const response = await apiClient.post<Subject>("/subjects", data);
            return response.data;
        } catch (error) {
            const message = extractErrorMessage(error, "Failed to create subject");
            throw new Error(message);
        }
    },

    update: async (id: number, data: UpdateSubjectDto) => {
        try {
            const response = await apiClient.patch<Subject>(`/subjects/${id}`, data);
            return response.data;
        } catch (error) {
            const message = extractErrorMessage(error, "Failed to update subject");
            throw new Error(message);
        }
    },

    delete: async (id: number) => {
        try {
            await apiClient.delete(`/subjects/${id}`);
        } catch (error) {
            const message = extractErrorMessage(error, "Failed to delete subject");
            throw new Error(message);
        }
    },
};
