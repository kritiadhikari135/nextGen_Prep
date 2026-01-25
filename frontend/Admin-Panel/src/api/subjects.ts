import apiClient from "./index";

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
            throw error;
        }
    },

    getById: async (id: number) => {
        try {
            const response = await apiClient.get<Subject>(`/subjects/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (data: CreateSubjectDto) => {
        try {
            const response = await apiClient.post<Subject>("/subjects", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: number, data: UpdateSubjectDto) => {
        try {
            const response = await apiClient.patch<Subject>(`/subjects/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: number) => {
        try {
            await apiClient.delete(`/subjects/${id}`);
        } catch (error) {
            throw error;
        }
    },
};
