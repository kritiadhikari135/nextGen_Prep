import { useState, useCallback } from "react";
import axios from "axios";
import { InputField } from "@/components/admin/AdminForm";
import Notification from "@/components/admin/Notification";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";

interface FormValues {
  email: string;
}

export default function ForgetPassword() {
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const validateEmail = useCallback((values: FormValues) => {
    const errors: Record<string, string> = {};
    if (!values.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  }, []);

  const { values, errors, handleChange, handleSubmit, resetForm, setErrors } = useForm<FormValues>(
    { email: "" },
    validateEmail
  );

  const onSubmit = async (formValues: FormValues) => {
    setSubmitLoading(true);
    setNotification(null);

    try {
      await axios.post("/api/account/forgot-password", { email: formValues.email });

      setNotification({
        type: "success",
        message: "If this email is registered, a reset link has been sent.",
      });
      resetForm();
    } catch (error: any) {
      let message = "Failed to send password reset email";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
        if (message.toLowerCase().includes("email")) {
          setErrors({ email: message });
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
      <h1 className="text-3xl font-bold">Forgot Password</h1>
      <p>Enter your email to receive a password reset link.</p>

      <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-4">
        <InputField
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={(e) => {
            setNotification(null);
            handleChange(e);
          }}
          error={errors.email}
          required
        />
        <Button type="submit" >
          Send Reset Link
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
