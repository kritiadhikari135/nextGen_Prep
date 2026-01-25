import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputField, TextAreaField, SelectField } from "@/components/admin/AdminForm";
import Notification from "@/components/admin/Notification";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { ArrowLeft } from "lucide-react";
import { projectApi } from "@/api/project";
import { DragDropImageUpload } from "@/components/admin/DragDrogImageUpload"; 


export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { values, errors, handleChange, handleSubmit, setValues } = useForm({
    title: "",
    category: "",
    problem: "",
    solution: "",
    image: { url: "" } as { url: string } | File | null,
    technologies: "",
    description:"",
    liveLink:"",
  });
  
  // Fetch project by ID
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const response = await projectApi.getById(id);
        if (response.data) {
          setValues(response.data);
        }
      } catch (error: any) {
        console.error("Error fetching project:", error.response?.data || error.message);
        setNotification({ type: "error", message: "Failed to load project details" });
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  // Update project with FormData
  const onSubmit = async () => {
    if (!id) return;
    
    setSubmitLoading(true);
    try {
      // Create FormData object
      const formData = new FormData();
      // Append text fields
      formData.append("title", values.title);
      formData.append("category", values.category);
      formData.append("problem", values.problem);
      formData.append("solution", values.solution);
      formData.append("technologies", values.technologies);
      formData.append("description", values.description);
      formData.append("liveLink", values.liveLink);
      
      // Handle image - check if it's a File object or a string (URL)
      if (values.image) {
        if (values.image instanceof File) {
          formData.append("image", values.image);
        } else if (typeof values.image === "string") {
          // If it's already a URL/path and hasn't changed, you might want to handle this differently
          formData.append("image", values.image);
        }
      }
      
      const response = await projectApi.update(id, formData);
      if (response.success) {
        setNotification({ type: "success", message: "Project updated successfully" });
        setTimeout(() => navigate("/projects"), 500);
      }
    } catch (error: any) {
      console.error("Error updating project:", error.response?.data || error.message);
      setNotification({ type: "error", message: "Failed to update project" });
    } finally {
      setSubmitLoading(false);
    }
  };
  if (submitLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }
  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Project</h1>
            <p className="text-muted-foreground">Update project details</p>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <InputField
            label="Title"
            name="title"
            value={values.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <TextAreaField
            label="Description"
            name="description"
            value={values.description}
            onChange={handleChange}
            error={errors.description}
            required
          />

          <TextAreaField
            label="Problem"
            name="problem"
            value={values.problem}
            onChange={handleChange}
            error={errors.problem}
            required
          />
          
          <TextAreaField
            label="Solution"
            name="solution"
            value={values.solution}
            onChange={handleChange}
            error={errors.solution}
            required
          />

          <SelectField
            label="Category"
            name="category"
            value={values.category}
            onChange={handleChange}
            error={errors.category}
            placeholder="Select Category"
            required
            options={[
              { value: 'none', label: 'Select a category' },
              { value: 'mm', label: 'mm' },
              
            ]}
          />
          
          <TextAreaField
            label="Technologies"
            name="technologies"
            value={values.technologies}
            onChange={handleChange}
            error={errors.technologies}
            required
          />

          <DragDropImageUpload
            label="Project Image"
            value={values.image}
            onChange={(value) => setValues({ ...values, image: value })}
            error={errors.image}
          />
          <InputField
            label="Link"
            name="liveLink"
            value={values.liveLink}
            onChange={handleChange}
            error={errors.liveLink}
            required
          />

          <div className="flex gap-4">
            <Button type="submit" >
              Update Project
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/projects")}>
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