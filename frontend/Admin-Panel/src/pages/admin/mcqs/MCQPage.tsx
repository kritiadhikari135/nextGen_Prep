import { useState, useEffect } from "react";
import { BookOpen, Layers, List, Upload, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { topicsApi, Topic } from "@/api/topics";
import { subjectsApi, Subject } from "@/api/subjects";
import SingleMCQForm from "./components/SingleMCQForm";
import MCQSidebarList from "./components/MCQSidebarList";
import BulkUploadTab from "./components/BulkUploadTab";
import MCQFullList from "./components/MCQFullList";

type Tab = "single" | "bulk" | "view";

export default function MCQPage() {
    const [activeTab, setActiveTab] = useState<Tab>("single");
    const [topicId, setTopicId] = useState<number | null>(null);
    const [topicName, setTopicName] = useState("");
    const [topics, setTopics] = useState<Topic[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [showTopicDropdown, setShowTopicDropdown] = useState(false);
    const [topicError, setTopicError] = useState<string>("");
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

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
            {/* Topic Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-blue-200 shadow-lg">
                        <Layers className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">MCQ Topics</h2>
                    </div>
                </div>

                <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 w-full md:w-auto min-w-[300px]">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block px-1">Select Topic</label>
                    <div className="relative">
                        <div className="flex items-center gap-2 bg-white rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                            <BookOpen className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400"
                                placeholder="Type to search topics..."
                                value={topicName}
                                onChange={(e) => handleTopicInputChange(e.target.value)}
                                onFocus={() => setShowTopicDropdown(true)}
                            />
                            <ChevronDown className="h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Dropdown */}
                        {showTopicDropdown && topicName && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
                                {filteredTopics.length > 0 ? (
                                    filteredTopics.map(topic => (
                                        <button
                                            key={topic.id}
                                            type="button"
                                            onClick={() => handleTopicSelect(topic)}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors flex items-center justify-between border-b last:border-b-0"
                                        >
                                            <div>
                                                <div className="font-medium text-sm">{topic.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {subjects.find(s => s.id === topic.subject_id)?.name}
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-sm text-red-600 font-medium">
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
                            <div className="text-xs text-red-500 mt-1">{topicError}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <Button
                    variant={activeTab === "single" ? "default" : "secondary"}
                    onClick={() => setActiveTab("single")}
                    className={`rounded-lg ${activeTab === "single" ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                >
                    <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        <span>Single</span>
                    </div>
                </Button>
                <Button
                    variant={activeTab === "bulk" ? "default" : "secondary"}
                    onClick={() => setActiveTab("bulk")}
                    className={`rounded-lg ${activeTab === "bulk" ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                >
                    <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        <span>Bulk Upload</span>
                    </div>
                </Button>
                <Button
                    variant={activeTab === "view" ? "default" : "secondary"}
                    onClick={() => setActiveTab("view")}
                    className={`rounded-lg ${activeTab === "view" ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                >
                    <div className="flex items-center gap-2">
                        <List className="h-4 w-4" />
                        <span>View MCQs</span>
                    </div>
                </Button>
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === "single" && (
                    <div className="grid lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-7 xl:col-span-8">
                            <SingleMCQForm topicId={topicId} onSuccess={handleSuccess} />
                        </div>
                        <div className="lg:col-span-5 xl:col-span-4">
                            <MCQSidebarList topicId={topicId} refreshTrigger={refreshTrigger} />
                        </div>
                    </div>
                )}

                {activeTab === "bulk" && (
                    <BulkUploadTab topicId={topicId} />
                )}

                {activeTab === "view" && (
                    <MCQFullList topicId={topicId} />
                )}
            </div>
        </div>
    );
}
