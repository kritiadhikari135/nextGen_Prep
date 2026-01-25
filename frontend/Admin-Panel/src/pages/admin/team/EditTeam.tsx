import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputField, TextAreaField, SelectField } from "@/components/admin/AdminForm";
import Notification from "@/components/admin/Notification";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { ArrowLeft } from "lucide-react";
import { teamMemberApi } from "@/api/team-member"; 
import { DragDropImageUpload } from "@/components/admin/DragDrogImageUpload"; 


export default function EditTeam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [loading, setLoading] = useState(true);

  const { values, errors, handleChange, handleSubmit, setValues } = useForm({
    name: "",
    title: "",
    bio: "",
    role:"",
    photoUrl: { url: "" } as { url: string } | File | null,
    status: "",
    joinedDate: "",
  });

  // Fetch the team details from the API on mount
  useEffect(() => {
    const fetchTeam = async () => {
      if (!id) return;

      try {
        const response = await teamMemberApi.getById(id);
        if (response.data) {
          setValues(response.data);
        }
      } catch (error) {
        console.error("Error fetching team data", error);
        setNotification({ type: "error", message: "Failed to fetch team member data" });
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  const onSubmit = async () => {
    if (!id) return;

    setSubmitLoading(true);
    try {
      // Create FormData object
      const formData = new FormData();
      
      // Append text fields
      formData.append("name", values.name);
      formData.append("title", values.title);
      formData.append("bio", values.bio);

      
      // Handle image - only append if it's a new File
      if (values.photoUrl && values.photoUrl instanceof File) {
        formData.append("image", values.photoUrl);
      } else if (values.photoUrl && typeof values.photoUrl === "object" && "url" in values.photoUrl) {
        // If it's an existing image URL, send it as is
        formData.append("image", values.photoUrl.url);
      }

      const response = await teamMemberApi.update(id, formData);

      if (response.success) {
        setNotification({ type: "success", message: "Team member updated successfully" });
        setTimeout(() => navigate("/team"), 500);
      }
    } catch (error: any) {
      console.error("Error updating team data", error.response?.data || error.message);
      setNotification({ type: "error", message: "Failed to update team member" });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading || submitLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/teams")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Team Member</h1>
            <p className="text-muted-foreground">Update team member details</p>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <InputField
            label="Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <InputField
            label="Title"
            name="title"
            value={values.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <SelectField
            label="Role"
            name="role"
            value={values.role}
            onChange={handleChange}
            error={errors.role}
            placeholder="Select role"
            required
            options={[
              
              { value: 'Administrator', label: 'Administrator' },
            ]}
          />

          <TextAreaField
            label="Bio"
            name="bio"
            value={values.bio}
            onChange={handleChange}
            error={errors.bio}
            rows={4}
          />

          <DragDropImageUpload
            label="Team Member Image"
            value={values.photoUrl}
            onChange={(value) => setValues({ ...values, photoUrl: value })}
            error={errors.photoUrl}
          />

          <div className="flex gap-4">
            <Button type="submit" >
              Update Team Member
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/team")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>

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