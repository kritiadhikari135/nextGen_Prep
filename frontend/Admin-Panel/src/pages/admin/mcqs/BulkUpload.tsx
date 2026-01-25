import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Notification from "@/components/admin/Notification";
import { mcqApi } from "@/api/mcq";
import { topicsApi, Topic } from "@/api/topics";
import { subjectsApi, Subject } from "@/api/subjects";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { ChevronDown } from "lucide-react";

export default function BulkUpload() {
  const navigate = useNavigate();
  const [topicId, setTopicId] = useState<number | null>(null);
  const [topicName, setTopicName] = useState<string>("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [topicError, setTopicError] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<null | { type: "success" | "error"; message: string }>(null);

  useEffect(() => {
    fetchTopics();
    fetchSubjects();
  }, []);

  const fetchTopics = async () => {
    const data = await topicsApi.getAll();
    setTopics(data);
  };

  const fetchSubjects = async () => {
    const data = await subjectsApi.getAll();
    setSubjects(data);
  };

  const filteredTopics = topics.filter(t =>
    t.name.toLowerCase().includes(topicName.toLowerCase())
  );

  const handleTopicSelect = (topic: Topic) => {
    setTopicId(topic.id);
    setTopicName(topic.name);
    setTopicError("");
    setShowTopicDropdown(false);
  };

  const handleTopicInputChange = (value: string) => {
    setTopicName(value);
    setShowTopicDropdown(true);
    setTopicId(null);
    setTopicError("");
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!topicId) {
      setTopicError("Please select a topic");
      return;
    }
    if (!file) return setNotification({ type: "error", message: "Select a file" });
    setLoading(true);
    try {
      const res = await mcqApi.bulkUploadPractice(topicId, file);
      setNotification({ type: "success", message: `Uploaded. inserted: ${res.inserted || 0}` });
      setTimeout(() => navigate("/mcqs"), 800);
    } catch (error: any) {
      console.error(error);
      setNotification({ type: "error", message: error?.response?.data?.message || "Bulk upload failed" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bulk Upload Practice MCQs</h1>
        <p className="text-muted-foreground">Upload CSV/XLSX with MCQs for practice.</p>
      </div>

      <form className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block mb-2">Topic *</label>
          <div className="relative">
            <input
              type="text"
              className="input"
              placeholder="Type to search topics..."
              value={topicName}
              onChange={(e) => handleTopicInputChange(e.target.value)}
              onFocus={() => setShowTopicDropdown(true)}
            />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

            {/* Dropdown */}
            {showTopicDropdown && topicName && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
                {filteredTopics.length > 0 ? (
                  filteredTopics.map(topic => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleTopicSelect(topic)}
                      className="w-full text-left px-3 py-2 hover:bg-muted transition-colors flex flex-col border-b last:border-b-0"
                    >
                      <div className="font-medium text-sm">{topic.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {subjects.find(s => s.id === topic.subject_id)?.name}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-destructive font-medium">
                    ❌ Topic not found
                  </div>
                )}
              </div>
            )}

            {/* Show selected topic */}
            {topicId && (
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                ✓ Selected: {topicName}
              </div>
            )}

            {topicError && (
              <div className="text-xs text-destructive mt-1">{topicError}</div>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2">File</label>
          <input type="file" accept=".csv,.xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>

        <div className="flex gap-4">
          <Button type="submit">Upload</Button>
          <Button variant="outline" onClick={() => navigate("/mcqs")}>Cancel</Button>
        </div>
      </form>

      {notification && (
        <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
      )}
    </div>
  );
}
