import { useState } from "react";
import { InputField } from "@/components/admin/AdminForm";
import Notification from "@/components/admin/Notification";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/useAuth";
import { useForm } from "@/hooks/useForm";
import { NavLink,useNavigate } from "react-router-dom";
import axios from "axios";
import { authApi } from "@/api/auth";


interface ProfileFormValues {
  username: string;
  email: string;
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = (values: ProfileFormValues) => {
    const errors: Partial<Record<keyof ProfileFormValues, string>> = {};
    if (!values.username.trim()) errors.username = "Name is required";
    if (!values.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  const { values, errors, handleChange, handleSubmit, setErrors } = useForm<ProfileFormValues>(
    {
      username: user?.username || "",
      email: user?.email || "",
    },
    validate
  );
  

  const onSubmit = async (formValues: ProfileFormValues) => {
    setIsSubmitting(true);
    setNotification(null);

    try {
      const response =  await authApi.updateprofile(formValues.email, formValues.username    
      );
      // Update auth context
      updateUser?.(response.data);
      setNotification({ type: "success", message: "Profile updated successfully" });
      navigate("/dashboard");
    } catch (error: any) {
      let message = "Failed to update profile";

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          message = error.response.data.message;
        }
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
      }

      setNotification({ type: "error", message });
    } finally {
      setIsSubmitting(false);
      
    }
  };

  return (
    <>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <InputField
            label="Name"
            name="username"
            value={values.username}
            onChange={handleChange}
            error={errors.username}
            required
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <div className="flex gap-5">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Profile"}
            </Button>

            <NavLink to="/settings/forgetpassword">
              <Button type="button">Forget Password</Button>
            </NavLink>
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
