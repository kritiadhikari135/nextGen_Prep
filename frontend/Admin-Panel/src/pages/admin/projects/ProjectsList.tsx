import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminTable } from "@/components/admin/AdminTable";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import Notification from "@/components/admin/Notification";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { projectApi } from "@/api/project";

export default function ProjectsList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    project: any;
  }>({ isOpen: false, project: null });
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectApi.getAll();
      setProjects(response.data);
    } catch (error: any) {
      console.error(
        "Error fetching projects:",
        error.response?.data || error.message,
      );
      setNotification({ type: "error", message: "Failed to fetch projects" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Delete project
  const handleDelete = async () => {
    if (!deleteModal.project) return;

    setIsDeleting(true);
    try {
      await projectApi.delete(deleteModal.project._id);
      // Remove the deleted project from the projects array
      setProjects((prevProjects) =>
        prevProjects.filter(
          (project) => project._id !== deleteModal.project._id,
        ),
      );
      setNotification({
        type: "success",
        message: "Project deleted successfully",
      });

      setDeleteModal({ isOpen: false, project: null });
    } catch (error: any) {
      console.error(
        "Error deleting project:",
        error.response?.data || error.message,
      );
      setNotification({ type: "error", message: "Failed to delete project" });
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    {
      key: "technologies",
      label: "Technologies Used",
      render: (technologies: string[]) => (
        <ul className="list-disc ml-5">
          {technologies?.map((technology, index) => (
            <li key={index}>{technology}</li>
          ))}
        </ul>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground">
              Manage your portfolio projects
            </p>
          </div>
          <Button onClick={() => navigate("/projects/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        <AdminTable
          columns={columns}
          data={projects || []}
          onEdit={(row) => navigate(`/projects/edit/${row._id}`)}
          onDelete={(row) => setDeleteModal({ isOpen: true, project: row })}
        />
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, project: null })}
        onConfirm={handleDelete}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
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
