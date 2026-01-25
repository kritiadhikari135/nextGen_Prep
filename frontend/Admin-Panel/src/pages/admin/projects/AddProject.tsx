import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputField, TextAreaField, SelectField } from "@/components/admin/AdminForm";
import Notification from "@/components/admin/Notification";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { ArrowLeft } from "lucide-react";
import { projectApi } from "@/api/project";
import { DragDropImageUpload } from "@/components/admin/DragDrogImageUpload";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";

export default function AddProject() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);



  const { values, errors, handleChange, handleSubmit, setValues } = useForm({
    title: "",
    problem: "",
    solution: "",
    category: "none",
    image: null,
    technologies: "",
    liveLink: "",
    description: "",
  });

  const onSubmit = async () => {
    setLoading(true);
    try {
      // Create FormData object
      const formData = new FormData();

      // Append text fields
      formData.append("title", values.title);
      formData.append("problem", values.problem);
      formData.append("solution", values.solution);
      formData.append("category", values.category);
      formData.append("technologies", values.technologies);
      formData.append("description", values.description);
      formData.append("liveLink", values.liveLink);

      // Handle image - only append if it's a File
      if (values.image && values.image instanceof File) {
        formData.append("image", values.image);
      }

      const response = await projectApi.create(formData);

      if (response.success) {
        setNotification({ type: "success", message: "Project created successfully" });
        setTimeout(() => navigate("/projects"), 500);
      }
    } catch (error: any) {
      console.error("Error creating project:", error.response?.data || error.message);
      setNotification({ type: "error", message: "Failed to create project" });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
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
          <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add Project</h1>
            <p className="text-muted-foreground">Create a new project</p>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <InputField
            label="Title"
            name="title"
            value={values.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="mm"
            required
          />
          <TextAreaField
            label="Description"
            name="description"
            value={values.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="mm"
            required
          />
          <TextAreaField
            label="Problem"
            name="problem"
            value={values.problem}
            onChange={handleChange}
            error={errors.problem}
            placeholder="mm"
            required
          />

          <TextAreaField
            label="Solution"
            name="solution"
            value={values.solution}
            onChange={handleChange}
            error={errors.solution}
            placeholder="mm"
            required
          />

          <SelectField
            label="Category"
            name="category"
            value={values.category}
            onChange={handleChange}
            error={errors.category}
            placeholder="mm"
            required
            options={[
              { value: 'none', label: 'Select a category' },
              { value: 'nnn', label: 'nn' },
              
            ]}
          />

          <DragDropImageUpload
            label=" Image"
            value={values.image}
            onChange={(value) => setValues({ ...values, image: value })}
            error={errors.image}
          />

          <TextAreaField
            label="Technologies"
            name="technologies"
            value={values.technologies}
            onChange={handleChange}
            error={errors.technologies}
            placeholder="mm"
            required
          />

          <InputField
            label="Link"
            name="liveLink"
            value={values.liveLink}
            onChange={handleChange}
            error={errors.liveLink}
            placeholder="mmm"
            required
          />

          <div className="flex gap-4">
            <Button type="submit" >
              Create Project
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