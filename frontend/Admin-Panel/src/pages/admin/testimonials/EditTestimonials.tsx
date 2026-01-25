import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputField, TextAreaField, SelectField } from "@/components/admin/AdminForm";
import Notification from "@/components/admin/Notification";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { ArrowLeft } from "lucide-react";
import { testimonialsApi } from "@/api/testimonials"; 
import { DragDropImageUpload } from "@/components/admin/DragDrogImageUpload"; 


export default function EditTestimonials() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [loading, setLoading] = useState(true);

  const { values, errors, handleChange, handleSubmit, setValues } = useForm({
    name: "",
    role: "",
    company: "",
    photoUrl: { url: "" } as { url: string } | File | null,
    rating: null,
    quote: "",
  });

  // Fetch the testimonials details from the API on mount
  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!id) return;

      try {
        const response = await testimonialsApi.getById(id);
        if (response.data) {
          setValues(response.data);
        }
      } catch (error) {
        console.error("Error fetching testimonials", error);
        setNotification({ type: "error", message: "Failed to fetch testimonials data" });
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [id]);

  const onSubmit = async () => {
    if (!id) return;

    setSubmitLoading(true);
    try {
      // Create FormData object
      const formData = new FormData();
      
      // Append text fields
      formData.append("name", values.name);
      formData.append("role", values.role);
      formData.append("company", values.company);
      formData.append("rating",values.rating);
      formData.append("quote", values.quote);

      
      // Handle image - only append if it's a new File
      if (values.photoUrl && values.photoUrl instanceof File) {
        formData.append("image", values.photoUrl);
      } else if (values.photoUrl && typeof values.photoUrl === "object" && "url" in values.photoUrl) {
        // If it's an existing image URL, send it as is
        formData.append("image", values.photoUrl.url);
      }

      const response = await testimonialsApi.update(id, formData);

      if (response.success) {
        setNotification({ type: "success", message: "Testimonials updated successfully" });
        setTimeout(() => navigate("/testimonials"), 500);
      }
    } catch (error: any) {
      console.error("Error updating testimonials", error.response?.data || error.message);
      setNotification({ type: "error", message: "Failed to update testimonials" });
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
            <h1 className="text-3xl font-bold text-foreground">Edit Testimonials</h1>
            <p className="text-muted-foreground">Update testimonials details</p>
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
            label="Role"
            name="role"
            value={values.role}
            onChange={handleChange}
            error={errors.role}
            required
          />

          <TextAreaField
            label="Company"
            name="company"
            value={values.company}
            onChange={handleChange}
            error={errors.company}
            rows={4}
          />

          <DragDropImageUpload
            label="Team Member Image"
            value={values.photoUrl}
            onChange={(value) => setValues({ ...values, photoUrl: value })}
            error={errors.photoUrl}
          />

          <InputField
            label="rating"
            name="rating"
            value={values.rating}
            onChange={handleChange}
            error={errors.rating}
            required
          />

          <TextAreaField
            label="Quote"
            name="quote"
            value={values.quote}
            onChange={handleChange}
            error={errors.quote}
            rows={4}
          />


          <div className="flex gap-4">
            <Button type="submit" >
              Update Testimonials
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/testimonials")}>
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