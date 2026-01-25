import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AdminTable } from "@/components/admin/AdminTable";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import Notification from "@/components/admin/Notification";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { teamMemberApi } from "@/api/team-member"; 


export default function TeamsList() {
  const navigate = useNavigate();
  // States
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; team: any }>({ isOpen: false, team: null });
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch teams from the API
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response =  await teamMemberApi.getAll();
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams", error);
      setNotification({ type: "error", message: "Failed to fetch teams" });
    } finally {
      setLoading(false);
    }
  };

  // Handle team deletion
  const handleDelete = async () => {
    if (!deleteModal.team) return;

    setIsDeleting(true);
    try {
      await teamMemberApi.delete(deleteModal.team._id);
      setNotification({ type: "success", message: "Team member deleted successfully" });
      fetchTeams(); // Refetch after deletion
      setDeleteModal({ isOpen: false, team: null });
    } catch (error) {
      setNotification({ type: "error", message: "Failed to delete team member" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Use effect to fetch teams when the component mounts
  useEffect(() => {
    fetchTeams();
  }, []);

  // Table columns
  const columns = [
    { key: "name", label: "Name" },
    { key: "title", label: "Title" },
    {key:"role", label:"Role"},
    {
      key: "bio",
      label: "Description",
      render: (bio: string) => (
        <div className="line-clamp-1">
          {bio}
        </div>
      )
    }
  ];

  // Loading state
  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teams</h1>
            <p className="text-muted-foreground">Manage team members</p>
          </div>
          <Button onClick={() => navigate("/team/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        <AdminTable
          columns={columns}
          data={teams}
          onEdit={(row) => navigate(`/team/edit/${row._id}`)}
          onDelete={(row) => setDeleteModal({ isOpen: true, team: row })}
        />
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, team: null })}
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
