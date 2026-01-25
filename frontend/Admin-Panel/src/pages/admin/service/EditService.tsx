import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputField, TextAreaField, SelectField } from "@/components/admin/AdminForm";
import  Notification  from "@/components/admin/Notification";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { ArrowLeft } from "lucide-react";
import { serviceApi } from "@/api/service";


export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);



  const { values, errors, handleChange, handleSubmit, setValues } = useForm({
    title: "",
    description: "",
    icon: "",
    tools: "",
    features: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      try {
        const response = await serviceApi.getById(id);  
        if (response) {
          setValues(response.data);
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        setNotification({ type: "error", message: "Failed to load service details" });
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const onSubmit = async (formValues) => {
    
    if (!id) return;
    const toolsArray = Array.isArray(formValues.tools) ? formValues.tools : formValues.tools
      .split(",")
      .map(tool => tool.trim())
      .filter(tool => tool.length > 0);

    const featuresArray = Array.isArray(formValues.features) ? formValues.features : formValues.features
      .split(",")
      .map(feature => feature.trim())
      .filter(feature => feature.length > 0);

      const updatedValues = { ...formValues, tools: toolsArray, features: featuresArray };

    setSubmitLoading(true);
    try {
      const response = await serviceApi.update(id, updatedValues);
      if (response.success) {
        setNotification({ type: "success", message: "Service updated successfully" });
        setTimeout(() => navigate("/service"), 500); 
      }
    } catch (error) {
      console.error("Error updating service:", error);
      setNotification({ type: "error", message: "Failed to update service" });
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
          <Button variant="ghost" size="icon" onClick={() => navigate("/services")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Subjects</h1>
            <p className="text-muted-foreground">Update Subject details</p>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
          
          <InputField
            label="Icon"
            name="icon"
            value={values.icon}
            onChange={handleChange}
            error={errors.icon}
            placeholder="mmm"
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

          <TextAreaField
            label="Description"
            name="description"
            value={values.description}
            onChange={handleChange}
            error={errors.description}
            required
          />
          
          <InputField
            label="Tools"
            name="tools"
            value={values.tools}
            onChange={handleChange}
            error={errors.tools}
            required
          />

          <InputField
            label="Features"
            name="features"
            value={values.features}
            onChange={handleChange}
            error={errors.features}
            required
          />

          <div className="flex gap-4">
            <Button type="submit" >
              Update Subjects
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/services")}>
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
