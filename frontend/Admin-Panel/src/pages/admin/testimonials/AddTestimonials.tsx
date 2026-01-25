import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputField, TextAreaField } from "@/components/admin/AdminForm";
import Notification from "@/components/admin/Notification";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { ArrowLeft } from "lucide-react";
import { DragDropImageUpload } from "@/components/admin/DragDrogImageUpload";
import { testimonialsApi } from "@/api/testimonials";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";

export default function AddTestimonials() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { values, errors, handleChange, handleSubmit, setValues } = useForm({
    name: "",
    role: "",
    company: "",
    image: null as File | null,
    ratings: null,
    quote:""
  });

  const onSubmit = async () => {
    setSubmitLoading(true);
    try {
      // Create FormData object
      const formData = new FormData();
      
      // Append text fields
      formData.append("name", values.name);
      formData.append("role", values.role);
      formData.append("company", values.company);
      formData.append("rating", values.ratings)
      formData.append("quote",values.quote)
      
      // Handle image - only append if it's a File
      if (values.image && values.image instanceof File) {
        formData.append("image", values.image);
      }
      
      const response = await testimonialsApi.create(formData);
      
      if (response.success) {
        setNotification({ type: "success", message: "Testimonials added successfully" });
        setTimeout(() => navigate("/testimonials"), 500);
      }
    } catch (error: any) {
      console.error("Error adding testimonials:", error.response?.data || error.message);
      setNotification({ 
        type: "error", 
        message: error.response?.data?.message || "Failed to add testimonials" 
      });
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

  return (
    <>
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/teams")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add Testimonials</h1>
            <p className="text-muted-foreground">Add a new Testimonials</p>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <InputField
            label="Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="John Doe"
            required
          />

          <InputField
            label="Role"
            name="role"
            value={values.role}
            onChange={handleChange}
            error={errors.role}
            placeholder="CEO"
            required
          />

          <TextAreaField
            label="Company"
            name="company"
            value={values.company}
            onChange={handleChange}
            error={errors.company}
            placeholder="Name of the Company"
            rows={4}
          />

          <DragDropImageUpload
            label="Reviewer Photo"
            value={values.image}
            onChange={(value) => setValues({ ...values, image: value })}
            error={errors.image}
          />

          <InputField
            label="Ratings"
            name="ratings"
            value={values.ratings}
            onChange={handleChange}
            error={errors.ratings}
            placeholder="5"
            required
          />

          <TextAreaField
            label="Quote"
            name="quote"
            value={values.quote}
            onChange={handleChange}
            error={errors.quote}
            placeholder="What they say"
            rows={4}
          />

          <div className="flex gap-4">
            <Button type="submit" >
              Add Testimonials
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