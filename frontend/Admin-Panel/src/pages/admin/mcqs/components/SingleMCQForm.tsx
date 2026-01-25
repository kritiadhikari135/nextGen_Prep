import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";
import { mcqApi, McqOptionDto } from "@/api/mcq";
import { toast } from "sonner";

interface SingleMCQFormProps {
    topicId: number | null;
    onSuccess: () => void;
}

export default function SingleMCQForm({ topicId, onSuccess }: SingleMCQFormProps) {
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

    const handleOptionChange = (index: number, value: string) => {
        const updated = [...options];
        updated[index].option_text = value;
        setOptions(updated);
    };

    const handleCorrectChange = (index: number) => {
        const updated = [...options];
        updated.forEach((opt, i) => {
            opt.is_correct = i === index;
        });
        setOptions(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topicId) {
            toast.error("Please select a topic first");
            return;
        }
        if (!questionText.trim()) {
            toast.error("Question text is required");
            return;
        }
        if (options.some(opt => !opt.option_text.trim())) {
            toast.error("All options are required");
            return;
        }
        if (!options.some(opt => opt.is_correct)) {
            toast.error("Please select a correct answer");
            return;
        }

        setLoading(true);
        try {
            await mcqApi.create(topicId as number, {
                question_text: questionText,
                explanation,
                difficulty: difficulty.toLowerCase(),
                options,
            });
            toast.success("MCQ added successfully");
            // Reset form
            setQuestionText("");
            setExplanation("");
            setOptions([
                { option_text: "", is_correct: false },
                { option_text: "", is_correct: false },
                { option_text: "", is_correct: false },
                { option_text: "", is_correct: false },
            ]);
            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to create MCQ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Add Single MCQ</h2>
                    <p className="text-sm text-gray-500">Create a new multiple choice question with 4 options</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label>Question Text <span className="text-red-500">*</span></Label>
                    <Textarea
                        placeholder="Enter your question here..."
                        className="min-h-[100px] bg-white border-gray-200 focus:bg-white text-gray-900 transition-colors resize-none"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Difficulty Level</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4">
                    <Label>Options <span className="text-red-500">*</span></Label>
                    <div className="space-y-3">
                        {options.map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-3 group">
                                <div className="flex-none w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-medium text-gray-500 text-sm">
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <Input
                                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                    className="flex-1 text-gray-900 bg-white border-gray-200"
                                    value={opt.option_text}
                                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                                />
                                <label className="flex items-center gap-2 cursor-pointer flex-none min-w-[80px]">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${opt.is_correct ? "border-blue-500 bg-blue-500" : "border-gray-300 hover:border-gray-400"}`}>
                                        {opt.is_correct && <div className="w-2 h-2 rounded-full bg-white" />}
                                        <input
                                            type="radio"
                                            name="correct_option"
                                            checked={opt.is_correct}
                                            onChange={() => handleCorrectChange(idx)}
                                            className="hidden"
                                        />
                                    </div>
                                    <span className={`text-sm ${opt.is_correct ? "text-blue-600 font-medium" : "text-gray-500"}`}>Correct</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Explanation (Optional)</Label>
                    <Textarea
                        placeholder="Explain why the correct answer is right..."
                        className="min-h-[100px] bg-white border-gray-200 focus:bg-white text-gray-900 transition-colors resize-none"
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                    />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                    {loading ? "Adding..." : "Add MCQ"}
                </Button>
            </form>
        </div>
    );
}
