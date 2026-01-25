import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { InputField } from "@/components/admin/AdminForm";
import Notification from "@/components/admin/Notification";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }, []);

  const validatePasswords = useCallback((values: FormValues) => {
    const errors: Record<string, string> = {};
    if (values.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  }, []);

  const { values, errors, handleChange, handleSubmit, resetForm, setErrors } = useForm<FormValues>(
    { newPassword: "", confirmPassword: "" },
    validatePasswords
  );

  const onSubmit = async (formValues: FormValues) => {
    if (!token) {
      setNotification({ type: "error", message: "Invalid or missing token." });
      return;
    }

    setSubmitLoading(true);
    setNotification(null);

    try {
      await axios.post("/api/account/reset-password", {
        token,
        newPassword: formValues.newPassword,
      });

      setNotification({ type: "success", message: "Password has been reset successfully!" });
      resetForm();
    } catch (error: any) {
      let message = "Failed to reset password";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
        if (message.toLowerCase().includes("password")) {
          setErrors({ newPassword: message });
        }
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
      <h1 className="text-3xl font-bold">Reset Password</h1>
      <p>Enter a new password for your account.</p>

      <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-4">
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
          label="Confirm Password"
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
          Reset Password
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
