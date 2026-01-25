import { useState, useCallback } from "react";
import axios from "axios";
import { InputField } from "@/components/admin/AdminForm";
import Notification from "@/components/admin/Notification";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";


interface FormValues {
  currentPassword: string;
  newEmail: string;
}

export default function ChangeEmail() {
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const validateEmailForm = useCallback((values: FormValues) => {
    const errors: Record<string, string> = {};

    if (!values.currentPassword.trim()) {
      errors.currentPassword = "Current password is required";
    }

    if (!values.newEmail.trim()) {
      errors.newEmail = "New email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(values.newEmail)) {
      errors.newEmail = "Invalid email address";
    }

    return errors;
  }, []);

  const { values, errors, handleChange, handleSubmit, resetForm, setErrors } = useForm<FormValues>(
    { currentPassword: "", newEmail: "" },
    validateEmailForm
  );

  const onSubmit = async (formValues: FormValues) => {
    setSubmitLoading(true);
    setNotification(null);

    try {
      await axios.post("/api/account/change-email", {
        currentPassword: formValues.currentPassword,
        newEmail: formValues.newEmail,
      });

      setNotification({
        type: "success",
        message: "Email change request successful! Please verify your new email.",
      });

      resetForm();
    } catch (error: any) {
      let message = "Failed to change email";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;

        // Map errors to fields if applicable
        if (message.toLowerCase().includes("password")) {
          setErrors({ currentPassword: message });
        } else if (message.toLowerCase().includes("email")) {
          setErrors({ newEmail: message });
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
      <h1 className="text-3xl font-bold">Change Email</h1>
      <p>Enter your current password and the new email address.</p>

      <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-4">
        <InputField
          label="Current Password"
          name="currentPassword"
          type="password"
          value={values.currentPassword}
          onChange={(e) => {
            setNotification(null);
            handleChange(e);
          }}
          error={errors.currentPassword}
          required
        />

        <InputField
          label="New Email"
          name="newEmail"
          type="email"
          value={values.newEmail}
          onChange={(e) => {
            setNotification(null);
            handleChange(e);
          }}
          error={errors.newEmail}
          required
        />

        <Button type="submit" >
          Change Email
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
