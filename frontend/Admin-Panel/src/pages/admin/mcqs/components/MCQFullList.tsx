import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, CheckCircle} from "lucide-react";
import { mcqApi } from "@/api/mcq";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface MCQFullListProps {
    topicId: number | null;
}

export default function MCQFullList({ topicId }: MCQFullListProps) {
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
    }, [topicId]);

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

    const getDifficultyColor = (diff: string) => {
        switch (diff?.toLowerCase()) {
            case 'easy': return 'bg-green-100 text-green-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'hard': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (!topicId) {
        return <div className="text-center py-20 text-muted-foreground">Please select a topic to view MCQs</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {loading ? (
                <div className="flex justify-center py-20">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">All MCQs ({mcqs.length})</h2>
                        <Button variant="outline" size="sm" onClick={fetchMcqs}>Refresh</Button>
                    </div>

                    {mcqs.length === 0 && <div className="text-muted-foreground text-center py-10">No MCQs found.</div>}

                    <div className="grid gap-6">
                        {mcqs.map((mcq, idx) => (
                            <div key={idx} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <Badge className={getDifficultyColor(mcq.difficulty)} variant="secondary">{mcq.difficulty || 'Medium'}</Badge>
                                        <h3 className="text-lg font-medium text-gray-900">{mcq.question_text}</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => { }}>Edit</Button>
                                        <Button variant="destructive" size="sm" onClick={() => setDeleteModal({ isOpen: true, mcq })}>Delete</Button>
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 rounded-lg p-4 space-y-2">
                                    {mcq.options?.map((opt: any, i: number) => (
                                        <div key={i} className={`flex items-center gap-3 p-2 rounded-md ${opt.is_correct ? "bg-green-50 border border-green-100" : ""}`}>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${opt.is_correct ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                                                {String.fromCharCode(65 + i)}
                                            </div>
                                            <span className={opt.is_correct ? "font-medium text-green-900" : "text-gray-600"}>
                                                {opt.option_text}
                                            </span>
                                            {opt.is_correct && <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />}
                                        </div>
                                    ))}
                                </div>

                                {mcq.explanation && (
                                    <div className="mt-4 text-sm text-gray-500 bg-blue-50/50 p-3 rounded-lg border border-blue-50">
                                        <span className="font-semibold text-blue-700">Explanation:</span> {mcq.explanation}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
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
