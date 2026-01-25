import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "@/components/admin/Notification";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { mcqApi, McqOptionDto } from "@/api/mcq";
import { topicsApi, Topic } from "@/api/topics";
import { subjectsApi, Subject } from "@/api/subjects";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";

export default function AddMcq() {
  const navigate = useNavigate();
  const [topicId, setTopicId] = useState<number | null>(null);
  const [topicName, setTopicName] = useState<string>("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [topicError, setTopicError] = useState<string>("");
  
  const [questionText, setQuestionText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [options, setOptions] = useState<McqOptionDto[]>([
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
  ]);
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

  const handleOptionChange = (index: number, field: "option_text" | "is_correct", value: any) => {
    const updated = [...options];
    // @ts-ignore
    updated[index][field] = value;
    setOptions(updated);
  };

  const onSubmit = async () => {
    if (!topicId) {
      setTopicError("Please select a topic");
      return;
    }
    setLoading(true);
    try {
      const response = await mcqApi.create(topicId, {
        question_text: questionText,
        explanation,
        difficulty,
        options,
      });
      
      if (response) {
        setNotification({ type: "success", message: "MCQ created successfully" });
        setTimeout(() => navigate("/mcqs"), 700);
      }
    } catch (error: any) {
      console.error(error);
      setNotification({ type: "error", message: error?.response?.data?.message || "Failed to create MCQ" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add MCQ</h1>
          <p className="text-muted-foreground">Create a new multiple choice question</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
        <div>
          <label className="block mb-2">Topic *</label>
          <div className="relative">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type to search topics..."
              value={topicName}
              onChange={(e) => handleTopicInputChange(e.target.value)}
              onFocus={() => setShowTopicDropdown(true)}
            />
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />

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
          <label className="block mb-2">Question Text</label>
          <textarea className="textarea" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
        </div>

        <div>
          <label className="block mb-2">Explanation</label>
          <textarea className="textarea" value={explanation} onChange={(e) => setExplanation(e.target.value)} />
        </div>

        <div>
          <label className="block mb-2">Difficulty</label>
          <input className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} placeholder="e.g. easy" />
        </div>

        <div>
          <label className="block mb-2">Options</label>
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-3 mb-2">
              <input className="input flex-1" value={opt.option_text} onChange={(e) => handleOptionChange(idx, "option_text", e.target.value)} placeholder={`Option ${idx + 1}`} />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={opt.is_correct} onChange={(e) => handleOptionChange(idx, "is_correct", e.target.checked)} />
                <span className="text-sm">Correct</span>
              </label>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button type="submit" >
            Add MCQ
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/mcqs")}>
            Cancel
          </Button>
        </div>
      </form>

      {notification && (
        <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
      )}
    </div>
  );
}
