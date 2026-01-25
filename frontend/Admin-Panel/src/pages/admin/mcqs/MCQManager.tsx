import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, BookOpen } from "lucide-react";
import { topicsApi, Topic } from "@/api/topics";
import { subjectsApi, Subject } from "@/api/subjects";
import AddMcqForm from "./AddMcqForm";
import MCQList from "./MCQList";
import { useNavigate } from "react-router-dom";
import BulkUploadForm from "./BulkUploadForm";

export default function MCQManager() {
    const navigate = useNavigate();
    const [topicId, setTopicId] = useState<number | null>(null);
    const [topicName, setTopicName] = useState<string>("");
    const [topics, setTopics] = useState<Topic[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [showTopicDropdown, setShowTopicDropdown] = useState(false);
    const [topicError, setTopicError] = useState<string>("");
    const [viewMode, setViewMode] = useState<"single" | "bulk">("single");
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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

    const handleMcqAdded = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="space-y-6 container mx-auto p-4 md:p-6 max-w-7xl animate-in fade-in duration-500">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-xl">
                        <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">MCQ Admin Panel</h1>
                        <p className="text-muted-foreground">Manage your question bank</p>
                    </div>
                </div>
            </div>

            {/* Topic Selector Card with Bulk Upload Button */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                            <BookOpen className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-1 relative">
                            <label className="text-sm font-medium text-muted-foreground mb-1 block">Select Topic *</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="flex h-12 w-full rounded-lg border border-input bg-card px-4 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground transition-all duration-200"
                                    placeholder="Type to search topics..."
                                    value={topicName}
                                    onChange={(e) => handleTopicInputChange(e.target.value)}
                                    onFocus={() => setShowTopicDropdown(true)}
                                />

                                {/* Dropdown */}
                                {showTopicDropdown && topicName && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-md shadow-lg z-20 max-h-64 overflow-y-auto">
                                        {filteredTopics.length > 0 ? (
                                            filteredTopics.map(topic => (
                                                <button
                                                    key={topic.id}
                                                    type="button"
                                                    onClick={() => handleTopicSelect(topic)}
                                                    className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex flex-col border-b last:border-b-0"
                                                >
                                                    <div className="font-medium text-sm">{topic.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {subjects.find(s => s.id === topic.subject_id)?.name}
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-destructive font-medium">
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
                    </div>
                    
                    <Button
                        variant={viewMode === "bulk" ? "default" : "secondary"}
                        className="rounded-lg px-6 flex items-center gap-2 whitespace-nowrap"
                        onClick={() => setViewMode("bulk")}
                    >
                        <Upload className="w-4 h-4" /> Bulk Upload
                    </Button>
                </div>
            </div>

            {/* Action Tabs */}
            <div className="flex gap-4 border-b border-border/50 pb-2 overflow-x-auto">
                <Button
                    variant={viewMode === "single" ? "default" : "secondary"}
                    className="rounded-full px-6"
                    onClick={() => setViewMode("single")}
                >
                    Single
                </Button>
            </div>

            {/* Content Area */}
            {viewMode === "single" ? (
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column: Add MCQ Form */}
                    <div className="w-full lg:w-5/12 order-1 lg:order-1">
                        <AddMcqForm topicId={topicId} onSuccess={handleMcqAdded} />
                    </div>

                    {/* Right Column: MCQ List */}
                    <div className="w-full lg:w-7/12 order-2 lg:order-2">
                        <MCQList topicId={topicId} refreshTrigger={refreshTrigger} />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column: Bulk Upload Form */}
                    <div className="w-full lg:w-5/12 order-1 lg:order-1">
                        <BulkUploadForm topicId={topicId} onSuccess={handleMcqAdded} />
                    </div>

                    {/* Right Column: MCQ List (Visible here too so user can see results) */}
                    <div className="w-full lg:w-7/12 order-2 lg:order-2">
                        <MCQList topicId={topicId} refreshTrigger={refreshTrigger} />
                    </div>
                </div>
            )}

        </div>
    );
}
