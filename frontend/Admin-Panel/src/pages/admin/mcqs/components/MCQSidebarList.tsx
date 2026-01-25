import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, List } from "lucide-react";
import { mcqApi } from "@/api/mcq";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface MCQSidebarListProps {
    topicId: number | null;
    refreshTrigger: number;
}

export default function MCQSidebarList({ topicId, refreshTrigger }: MCQSidebarListProps) {
    const [mcqs, setMcqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; mcq: any }>({ isOpen: false, mcq: null });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (topicId) {
            fetchMcqs();
        } else {
            setMcqs([]);
        }
    }, [topicId, refreshTrigger]);

    const fetchMcqs = async () => {
        setLoading(true);
        try {
            const response = await mcqApi.getByTopic(topicId as number);
            setMcqs(response.data || response || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch MCQs");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.mcq) return;
        setIsDeleting(true);
        try {
            await mcqApi.delete(deleteModal.mcq.id || deleteModal.mcq._id);
            setMcqs((prev) => prev.filter((m) => (m.id || m._id) !== (deleteModal.mcq.id || deleteModal.mcq._id)));
            toast.success("MCQ deleted");
            setDeleteModal({ isOpen: false, mcq: null });
        } catch (error) {
            toast.error("Failed to delete MCQ");
        } finally {
            setIsDeleting(false);
        }
    };

    // Helper to determine badge color based on difficulty
    const getDifficultyColor = (diff: string) => {
        switch (diff?.toLowerCase()) {
            case 'easy': return 'bg-green-100 text-green-700 hover:bg-green-100';
            case 'medium': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
            case 'hard': return 'bg-red-100 text-red-700 hover:bg-red-100';
            default: return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full min-h-[600px]">
            <div className="flex items-center gap-2 mb-6">
                <List className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">MCQ List</h2>
                <Badge variant="secondary" className="ml-auto rounded-full px-2">
                    {mcqs.length}
                </Badge>
            </div>
            <p className="text-sm text-gray-500 mb-4 -mt-4">View and manage existing questions for the selected topic</p>

            {loading ? (
                <div className="flex justify-center py-10">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                    {mcqs.length === 0 && (
                        <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg">
                            No MCQs found for this topic.
                        </div>
                    )}
                    {mcqs.map((mcq, idx) => (
                        <div key={idx} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow group bg-gray-50/30">
                            <div className="flex justify-between items-start mb-3">
                                <Badge className={`${getDifficultyColor(mcq.difficulty)} border-none shadow-none font-normal lowercase`}>
                                    {mcq.difficulty || 'medium'}
                                </Badge>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-red-600"
                                        onClick={() => setDeleteModal({ isOpen: true, mcq })}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                {mcq.question_text}
                            </h3>

                            {/* Optional: Show minimal options or just the question count/type */}
                        </div>
                    ))}
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, mcq: null })}
                onConfirm={handleDelete}
                title="Delete MCQ"
                description="Are you sure you want to delete this MCQ?"
                isLoading={isDeleting}
            />
        </div>
    );
}
