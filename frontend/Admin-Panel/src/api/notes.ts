import apiClient from "./index";

export interface Note {
  id: number;
  title: string;
  topic_id: number;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateNoteDto {
  title: string;
}

export interface UpdateNoteDto {
  title: string;
}

export const notesApi = {
  getAll: async () => {
    try {
      const response = await apiClient.get<Note[]>("/notes");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getByTopic: async (topicId: number) => {
    try {
      const response = await apiClient.get<Note[]>("/notes", {
        params: { topic_id: topicId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (noteId: number) => {
    try {
      const response = await apiClient.get<Note>(`/notes/${noteId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (topicId: number, data: CreateNoteDto, file: File) => {
    try {
      const formData = new FormData();
      formData.append("topic_id", topicId.toString());
      formData.append("title", data.title);
      formData.append("file", file);

      const response = await apiClient.post<Note>("/notes/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (noteId: number, data: UpdateNoteDto) => {
    try {
      const response = await apiClient.patch<Note>(`/notes/${noteId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (noteId: number) => {
    try {
      await apiClient.delete(`/notes/${noteId}`);
    } catch (error) {
      throw error;
    }
  },
};
