import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminTable } from "@/components/admin/AdminTable";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import Notification from "@/components/admin/Notification";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { messageApi } from "@/api/message"


export default function MessagesList() {
  const navigate = useNavigate();

  // States
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; message: any }>({ isOpen: false, message: null });
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch messages from API
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await messageApi.getAll() ;
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages", error);
      setNotification({ type: "error", message: "Failed to fetch messages" });
    } finally {
      setLoading(false);
    }
  };

  // Delete a message
  const handleDelete = async () => {
    if (!deleteModal.message) return;

    setIsDeleting(true);
    try {
      await messageApi.delete(deleteModal.message._id)
      
      // Remove the deleted message from the messages array
    setMessages((prevMessages) => 
      prevMessages.filter((msg) => msg._id !== deleteModal.message._id)
    );
      setNotification({ type: "success", message: "Message deleted successfully" });
      
      setDeleteModal({ isOpen: false, message: null });
    } catch (error) {
      console.error("Error deleting message", error);
      setNotification({ type: "error", message: "Failed to delete message" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Fetch messages on mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Table columns
  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "message", label: "Message" },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">View and manage contact form submissions</p>
        </div>

        <AdminTable
          columns={columns}
          data={messages || []}
          onView={(row) => navigate(`details/${row._id}`)}
          onDelete={(row) => setDeleteModal({ isOpen: true, message: row })}
        />
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, message: null })}
        onConfirm={handleDelete}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
        isLoading={isDeleting}
      />

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
}
