import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminTable } from "@/components/admin/AdminTable";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import Notification from "@/components/admin/Notification";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { serviceApi } from "@/api/service";

export default function ServicesList() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, service: null });
  const [notification, setNotification] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch services from the API
  const fetchServices = async () => {
    try {
      const response = await serviceApi.getAll();
      setServices(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching services", error);
      setNotification({ type: "error", message: "Failed to load services" });
      setLoading(false);
    }
  };

  // Fetch the services when the component mounts
  useEffect(() => {
    fetchServices();
  }, []);

  // Delete service
  const handleDelete = async () => {
    if (!deleteModal.service) return;

    setIsDeleting(true);
    try {
      await serviceApi.delete(deleteModal.service._id);
      // Remove the deleted service from the services array
      setServices((prevServices) =>
        prevServices.filter((service) => service._id !== deleteModal.service._id)
      );
      setNotification({ type: "success", message: "Service deleted successfully" });
      fetchServices(); // Refetch the services after deletion
      setDeleteModal({ isOpen: false, service: null });
    } catch (error) {
      console.error("Error deleting service", error);
      setNotification({ type: "error", message: "Failed to delete service" });
    }
    setIsDeleting(false);
  };

  // Table columns
  const columns = [
    { key: "title", label: "Title" },
    {
      key: "tools",
      label: "Tools",
      render: (tools: string[]) => (
        <ul className="list-disc ml-5">
          {tools?.map((tool, index) => (
            <li key={index}>{tool}</li>
          ))}
        </ul>
      )
    },
    { key: "description", label: "Description" },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Subjects</h1>
            <p className="text-muted-foreground">Manage your subjects</p>
          </div>
          <Button onClick={() => navigate("/service/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Subjects
          </Button>
        </div>

        <AdminTable
          columns={columns}
          data={services || []}
          onEdit={(row) => navigate(`/service/edit/${row._id}`)}
          onDelete={(row) => setDeleteModal({ isOpen: true, service: row })}

        />
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, service: null })}
        onConfirm={handleDelete}
        title="Delete Subjects"
        description="Are you sure you want to delete this subjects? This action cannot be undone."
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
