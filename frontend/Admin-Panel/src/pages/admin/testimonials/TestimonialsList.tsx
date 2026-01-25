import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminTable } from "@/components/admin/AdminTable";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import Notification from "@/components/admin/Notification";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { testimonialsApi } from "@/api/testimonials"; 


export default function TestimonialsList() {
  const navigate = useNavigate();
  // States
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; testimonials: any }>({ isOpen: false, testimonials: null });
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch tstimonials from the API
  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response =  await testimonialsApi.getAll();
      setTestimonials(response.data);
    } catch (error) {
      console.error("Error fetching testimonials", error);
      setNotification({ type: "error", message: "Failed to fetch testimonials" });
    } finally {
      setLoading(false);
    }
  };

  // Handle testimonials deletion
  const handleDelete = async () => {
    if (!deleteModal.testimonials) return;

    setIsDeleting(true);
    try {
      await testimonialsApi.delete(deleteModal.testimonials._id);
      setNotification({ type: "success", message: "Testimonials deleted successfully" });
      fetchTestimonials(); // Refetch after deletion
      setDeleteModal({ isOpen: false, testimonials: null });
    } catch (error) {
      setNotification({ type: "error", message: "Failed to delete testimonials" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Use effect to fetch testimonials when the component mounts
  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Table columns
  const columns = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key:"company", label: "Company" },
    { key:"rating", label:"Ratings"},
  ];

  // Loading state
  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Testimonials</h1>
            <p className="text-muted-foreground">Manage Testimonials</p>
          </div>
          <Button onClick={() => navigate("/testimonials/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonials
          </Button>
        </div>

        <AdminTable
          columns={columns}
          data={testimonials}
          onEdit={(row) => navigate(`/testimonials/edit/${row._id}`)}
          onDelete={(row) => setDeleteModal({ isOpen: true, testimonials: row })}
        />
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, testimonials: null })}
        onConfirm={handleDelete}
        title="Delete Team Member"
        description="Are you sure you want to delete this team member? This action cannot be undone."
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
