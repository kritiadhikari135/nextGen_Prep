import { useEffect } from "react";
import {  X } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { XCircle } from "lucide-react";

const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg backdrop-blur-md border animate-slide-in-right ${
        type === "success"
          ? "bg-green-500/10 border-green-500/50 text-green-400"
          : "bg-red-500/10 border-red-500/50 text-red-400"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="h-5 w-5" />
      ) : (
        <XCircle className="h-5 w-5" />
      )}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Notification;
