import apiClient from "./index";

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  updatedAt?: string;
  isRead?: boolean;
  isEdited?: boolean;
  attachments?: string[];
}


export interface UpdateMessageDto {
  content: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface MessageFilters {
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface MessageResponse {
  success: boolean;
  message: Message;
}

export interface MessagesResponse {
  success: boolean;
  messages: Message[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface UnreadCountResponse {
  success: boolean;
  count: number;
}

export interface BulkDeleteResponse {
  success: boolean;
  deletedCount: number;
}

export const messageApi = {
  // Get all messages with pagination
  getAll: async (params?: PaginationParams) => {
    try {
      const response = await apiClient.get("messages", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw new Error("Failed to fetch messages");
    }
  },

  // Get message by ID
  getById: async (id: string) => {
    try {
      const response = await apiClient.get(`messages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching message ${id}:`, error);
      throw new Error("Failed to fetch message");
    }
  },

  // Create new message
  create: async (data) => {
    try {
      const response = await apiClient.post("messages", data);
      return response.data;
    } catch (error) {
      console.error("Error creating message:", error);
      throw new Error("Failed to create message");
    }
  },

  // Update message
  update: async (id: string, data: UpdateMessageDto) => {
    try {
      const response = await apiClient.put(
        `messages/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating message ${id}:`, error);
      throw new Error("Failed to update message");
    }
  },

  // Delete message
  delete: async (id: string) => {
    try {
      const response = await apiClient.delete(
        `messages/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting message ${id}:`, error);
      throw new Error("Failed to delete message");
    }
  },

  // Get messages by conversation with filters
  getByConversation: async (
    userId: string,
    filters?: MessageFilters & PaginationParams
  ) => {
    try {
      const response = await apiClient.get<MessagesResponse>(
        `messages/conversation/${userId}`,
        { params: filters }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching conversation messages for user ${userId}:`,
        error
      );
      throw new Error("Failed to fetch conversation messages");
    }
  },

  // Mark message as read
  markAsRead: async (id: string) => {
    try {
      const response = await apiClient.patch<MessageResponse>(
        `messages/${id}/read`
      );
      return response.data;
    } catch (error) {
      console.error(`Error marking message ${id} as read:`, error);
      throw new Error("Failed to mark message as read");
    }
  },

  // Mark multiple messages as read
  markMultipleAsRead: async (ids: string[]) => {
    try {
      const response = await apiClient.post<{
        success: boolean;
        updatedCount: number;
      }>("messages/bulk-read", { ids });
      return response.data;
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw new Error("Failed to mark messages as read");
    }
  },

  // Get unread message count
  getUnreadCount: async (userId: string) => {
    try {
      const response = await apiClient.get<UnreadCountResponse>(
        `messages/unread/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching unread count for user ${userId}:`,
        error
      );
      throw new Error("Failed to fetch unread count");
    }
  },

  // Delete multiple messages
  deleteMultiple: async (ids: string[]) => {
    try {
      const response = await apiClient.post<BulkDeleteResponse>(
        "messages/bulk-delete",
        { ids }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting multiple messages:", error);
      throw new Error("Failed to delete messages");
    }
  },

  // Search messages
  search: async (query: string, params?: PaginationParams) => {
    try {
      const response = await apiClient.get<MessagesResponse>(
        "messages/search",
        {
          params: { query, ...params },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error searching messages:", error);
      throw new Error("Failed to search messages");
    }
  },

  // Get messages between two users
  getConversationBetween: async (
    userId1: string,
    userId2: string,
    params?: PaginationParams
  ) => {
    try {
      const response = await apiClient.get<MessagesResponse>(
        `messages/conversation/${userId1}/${userId2}`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching conversation between ${userId1} and ${userId2}:`,
        error
      );
      throw new Error("Failed to fetch conversation");
    }
  },
};