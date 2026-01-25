import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import Notification from "@/components/admin/Notification";
import { Button } from "@/components/ui/button";
import { ArrowLeft} from "lucide-react";
import { Mail} from "lucide-react";
import { User} from "lucide-react";
import {Calendar} from "lucide-react";
import { messageApi } from "@/api/message";

export default function MessageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch message by ID from the backend API
  useEffect(() => {
    const fetchMessage = async () => {
      if (!id) return;
      try {
        const response = await messageApi.getById(id);
        const data = response.data;
        setMessage(data);
        // If the message is unread, mark it as read
        
      } catch (error) {
        console.error("Error fetching message data", error);
        setNotification({ type: "error", message: "Failed to fetch message" });
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, [id]);


  

  if (loading) return <LoadingSpinner />;
  if (!message) return <div>Message not found</div>;

  return (
    <>
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/messages")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Message Details</h1>
            <p className="text-muted-foreground">View and respond to message</p>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">{message.subject}</h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  message.status === "unread"
                    ? "bg-blue-500/10 text-blue-400"
                    : message.status === "read"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-purple-500/10 text-purple-400"
                }`}
              >
                {message.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{message.name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{message.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(message.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Message:</h3>
            <p className="text-foreground whitespace-pre-wrap">{message.message}</p>
          </div>
          <div className="p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Company Name:</h3>
            <p className="text-foreground whitespace-pre-wrap">{message.company}</p>
          </div>
          <div className="p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Service Interest:</h3>
            <p className="text-foreground whitespace-pre-wrap">{message.serviceInterest}</p>
          </div>

          <div className="p-6 border-t border-border/50 bg-muted/20">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Quick Actions:</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`mailto:${message.email}?subject=Re: ${message.subject}`)}
              >
                Reply via Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(message.email)}
              >
                Copy Email
              </Button>
            </div>
          </div>
        </div>
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
