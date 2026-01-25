import { useState, useCallback } from "react";
import axios from "axios";
import { InputField } from "@/components/admin/AdminForm";
import Notification from "@/components/admin/Notification";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { authApi } from "@/api/auth";
import { useAuth } from "@/context/useAuth";
interface FormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePassword() {
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { logout } = useAuth();

  const validatePasswords = useCallback((values: FormValues) => {
    const errors: Record<string, string> = {};
    if (!values.oldPassword.trim()) errors.currentPassword = "Current password is required";
    if (values.newPassword.length < 8) errors.newPassword = "Password must be at least 8 characters";
    if (values.newPassword !== values.confirmPassword) errors.confirmPassword = "Passwords do not match";
    return errors;
  }, []);

  const { values, errors, handleChange, handleSubmit, resetForm, setErrors } = useForm<FormValues>(
    { oldPassword: "", newPassword: "", confirmPassword: "" },
    validatePasswords
  );

  const onSubmit = async (formValues: FormValues) => {
    setSubmitLoading(true);
    setNotification(null);

    try {
     const response =  await authApi.updatePassword(
          formValues.newPassword,
         formValues.oldPassword,
         
      );

      setNotification({ type: "success", message: "Password changed successfully!" });
      resetForm();
      logout();
    } catch (error: any) {
      let message = "Failed to change password";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
        if (message.toLowerCase().includes("current")) setErrors({ oldPassword: message });
        if (message.toLowerCase().includes("new")) setErrors({ newPassword: message });
      }
      setNotification({ type: "error", message });
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
    <div className="max-w-md space-y-6 mx-auto mt-10">
      <h1 className="text-3xl font-bold">Change Password</h1>
      <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-4">
        <InputField
          label="Current Password"
          name="oldPassword"
          type="password"
          value={values.oldPassword}
          onChange={(e) => {
            setNotification(null);
            handleChange(e);
          }}
          error={errors.oldPassword}
          required
        />
        <InputField
          label="New Password"
          name="newPassword"
          type="password"
          value={values.newPassword}
          onChange={(e) => {
            setNotification(null);
            handleChange(e);
          }}
          error={errors.newPassword}
          required
        />
        <InputField
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={(e) => {
            setNotification(null);
            handleChange(e);
          }}
          error={errors.confirmPassword}
          required
        />
        <Button type="submit" >
          Change Password
        </Button>
      </form>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
