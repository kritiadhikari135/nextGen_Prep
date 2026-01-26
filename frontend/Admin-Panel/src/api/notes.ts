import apiClient from "./index";
import { extractErrorMessage } from "@/lib/error-handler";

export interface Note {
  id: number;
  title: string;
  topic_id: number;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
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
      const response = await apiClient.get<Note[]>("/notes/all");
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to fetch notes");
      throw new Error(message);
    }
  },

  getByTopic: async (topicId: number) => {
    try {
      const response = await apiClient.get<Note[]>("/notes", {
        params: { topic_id: topicId },
      });
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to fetch notes");
      throw new Error(message);
    }
  },

  getById: async (noteId: number) => {
    try {
      const response = await apiClient.get<Note>(`/notes/${noteId}`);
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to fetch note");
      throw new Error(message);
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
      const message = extractErrorMessage(error, "Failed to create note");
      throw new Error(message);
    }
  },

  update: async (noteId: number, data: UpdateNoteDto) => {
    try {
      const response = await apiClient.patch<Note>(`/notes/${noteId}`, data);
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to update note");
      throw new Error(message);
    }
  },

  delete: async (noteId: number) => {
    try {
      await apiClient.delete(`/notes/${noteId}`);
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to delete note");
      throw new Error(message);
    }
  },
};
