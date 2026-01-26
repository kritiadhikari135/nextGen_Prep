import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { mcqApi, McqOptionDto } from "@/api/mcq";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import Notification from "@/components/admin/Notification";

interface AddMcqFormProps {
    topicId: string | number | null;
    onSuccess: () => void;
}

export default function AddMcqForm({ topicId, onSuccess }: AddMcqFormProps) {
    const [questionText, setQuestionText] = useState("");
    const [explanation, setExplanation] = useState("");
    const [difficulty, setDifficulty] = useState("Medium");
    const [options, setOptions] = useState<McqOptionDto[]>([
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
    ]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<null | { type: "success" | "error"; message: string }>(null);

    const handleOptionChange = (index: number, field: "option_text" | "is_correct", value: any) => {
        const updated = [...options];
        if (field === "is_correct") {
            // Ideally multiple choice can have multiple correct, but if single choice, reset others?
            // The UI shows radio buttons in screenshot 2 (circles), implying single correct answer?
            // In the screenshot they are circles but labeled "Correct". 
            // The code uses `checked={opt.is_correct}`. Let's assume standard behavior for now.
            // The user requested UI changes. Screenshot has radio-like circles. 
            // Checkbox is fine if multiple allowed. Let's stick to what was there but style it better.
            // Actually, let's keep it simple.
        }
        // @ts-ignore
        updated[index][field] = value;
        setOptions(updated);
    };

    const onSubmit = async () => {
        if (!topicId) {
            setNotification({ type: "error", message: "Please select a topic first." });
            return;
        }

        setLoading(true);
        try {
            const response = await mcqApi.create(Number(topicId), {
                question_text: questionText,
                explanation,
                difficulty,
                options,
            });

            if (response) {
                setNotification({ type: "success", message: "MCQ created successfully" });
                setQuestionText("");
                setExplanation("");
                setOptions([
                    { option_text: "", is_correct: false },
                    { option_text: "", is_correct: false },
                    { option_text: "", is_correct: false },
                    { option_text: "", is_correct: false },
                ]);
                onSuccess();
            }
        } catch (error: any) {
            console.error(error);
            const message = error instanceof Error 
              ? error.message 
              : error?.response?.data?.message || "Failed to create MCQ";
            setNotification({ type: "error", message });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "flex h-10 w-full rounded-md border border-input bg-card-glass px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground";
    const textareaClass = "flex min-h-[80px] w-full rounded-md border border-input bg-card-glass px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground";

    if (loading) return <div className="flex items-center justify-center h-40"><LoadingSpinner /></div>;

    return (
        <div className="space-y-6 bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl h-fit">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                    <span className="text-primary text-2xl">⊕</span> Add Single MCQ
                </h2>
                <p className="text-muted-foreground text-sm">Create a new multiple choice question with 4 options</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">

                <div>
                    <label className="block mb-2 text-sm font-medium text-foreground">Question Text *</label>
                    <textarea
                        className={textareaClass}
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="Enter your question here..."
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-foreground">Difficulty Level</label>
                    <select
                        className={inputClass}
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-foreground">Options *</label>
                    <div className="space-y-3">
                        {options.map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <span className="bg-muted text-muted-foreground w-8 h-8 flex items-center justify-center rounded-full font-bold text-xs">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <input
                                    className={inputClass}
                                    value={opt.option_text}
                                    onChange={(e) => handleOptionChange(idx, "option_text", e.target.value)}
                                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                />
                                <label className="flex items-center gap-2 cursor-pointer min-w-max">
                                    <input
                                        type="checkbox" // Keeping Checkbox as per original, though radio is more common for single choice
                                        className="w-4 h-4 accent-primary"
                                        checked={opt.is_correct}
                                        onChange={(e) => handleOptionChange(idx, "is_correct", e.target.checked)}
                                    />
                                    <span className="text-sm text-foreground">Correct</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-foreground">Explanation (Optional)</label>
                    <textarea
                        className={textareaClass}
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        placeholder="Explain why the correct answer is right..."
                    />
                </div>

                <Button type="submit" className="w-full">
                    Add MCQ
                </Button>
            </form>

            {notification && (
                <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
            )}
        </div>
    );
}
