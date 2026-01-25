import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputField, TextAreaField, SelectField } from "@/components/admin/AdminForm";
import Notification from "@/components/admin/Notification";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { ArrowLeft } from "lucide-react";
import { serviceApi } from "@/api/service";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";


export default function AddService() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const { values, errors, handleChange, handleSubmit } = useForm({
    icon:"",
    title: "",
    description: "",
    features: "",
    tools: "",
    
  });
const convertToArray = (str: string) => {
    return str.split(',').map(item => item.trim()).filter(item => item !== '');
  };
  const onSubmit = async () => {
    setLoading(true);
    try {
      const response =  await serviceApi.create({
      icon: values.icon,
      title: values.title,
      description: values.description,
      features: convertToArray(values.features),
      tools: convertToArray(values.tools),
    });
      if (response.success) {
        setNotification({ type: "success", message: "Service created successfully" });
        setTimeout(() => navigate("/service"), 500);
      }
    } catch (error: any) {
      console.error("Error creating service:", error.response?.data || error.message);
      setNotification({ type: "error", message: "Failed to create service" });
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
          <Button variant="ghost" size="icon" onClick={() => navigate("/services")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add Subjects</h1>
            <p className="text-muted-foreground">Create a new Subjects</p>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
          
          <InputField
            label="Icon"
            name="icon"
            value={values.icon}
            onChange={handleChange}
            error={errors.icon}
            placeholder="mm"
            required
          />
          <InputField
            label="Title"
            name="title"
            value={values.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="mmm"
            required
          />

          <TextAreaField
            label="Description"
            name="description"
            value={values.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="mmm"
            required
          />

          <TextAreaField
            label="features"
            name="features"
            value={values.features}
            onChange={handleChange}
            error={errors.features}
            placeholder="mm"
          />
          <TextAreaField
            label="tools"
            name="tools"
            value={values.tools}
            onChange={handleChange}
            error={errors.tools}
            placeholder="mmm"
          

          />

          <div className="flex gap-4">
            <Button type="submit" >
              Create Subjects
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/service")}>
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
