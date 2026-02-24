import { useEffect, useState } from "react";
import StatsCard from "@/components/admin/StatsCard";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { Users, BookOpen, Layers, FileText, CheckCircle2, Clipboard } from "lucide-react";

import apiClient from "@/api";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get("dashboard");
        
        console.log("📥 Raw Response:", {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          dataType: typeof response.data,
          data: response.data,
        });
        
        // Check if response is HTML (error page)
        if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE')) {
          throw new Error("Backend returned HTML error page - Backend may be down or unreachable");
        }
        
        // Handle direct data object (if backend returns flat response)
        const stats = response.data.data || response.data;
        
        if (!stats || typeof stats !== 'object') {
          throw new Error(`Invalid response format: expected object, got ${typeof stats}`);
        }
        
        setStats(stats);
        setError(null);
        
        console.log("✅ Dashboard stats loaded successfully:", stats);
        
      } catch (error: any) {
        console.error("❌ Error fetching dashboard stats:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          detail: error.response?.data?.detail,
          fullResponse: error.response?.data,
        });
        
        const errorMsg = 
          error.message.includes('HTML error page') 
            ? "❌ Backend returned HTML. Check backend logs and ensure /dashboard endpoint is working."
            : error.response?.data?.detail || error.message || "Failed to fetch dashboard stats";
        
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-destructive font-semibold">⚠️ Error Loading Dashboard</p>
          <p className="text-destructive text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of Next-Gen Prep metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total Users"
            value={stats?.users || 0}
            icon={Users}
          />
          <StatsCard
            title="Total Subjects"
            value={stats?.subjects || 0}
            icon={BookOpen}
          />
          <StatsCard
            title="Total Topics"
            value={stats?.topics || 0}
            icon={Layers}
          />
          <StatsCard
            title="Total Notes"
            value={stats?.notes || 0}
            icon={FileText}
          />
          <StatsCard
            title="Total MCQs"
            value={stats?.mcqs || 0}
            icon={CheckCircle2}
          />
          <StatsCard
            title="Total Mock Tests"
            value={stats?.mockTests || 0}
            icon={Clipboard}
          />
        </div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: "New project created", time: "2 hours ago", type: "project" },
              { action: "Blog post published", time: "5 hours ago", type: "blog" },
              { action: "New message received", time: "1 day ago", type: "message" },
              { action: "Service updated", time: "2 days ago", type: "service" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-foreground font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </>
  );
}
