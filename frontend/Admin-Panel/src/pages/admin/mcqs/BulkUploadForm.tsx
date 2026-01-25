import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Notification from "@/components/admin/Notification";
import { mcqApi } from "@/api/mcq";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface BulkUploadFormProps {
    topicId: string | number | null;
    onSuccess?: () => void;
}

export default function BulkUploadForm({ topicId, onSuccess }: BulkUploadFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<null | { type: "success" | "error"; message: string }>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (!topicId) return setNotification({ type: "error", message: "Please select a topic ID first from the top." });
        if (!file) return setNotification({ type: "error", message: "Select a file" });

        setLoading(true);
        try {
            const res = await mcqApi.bulkUploadPractice(Number(topicId), file);
            setNotification({ type: "success", message: `Uploaded successfully. inserted: ${res.inserted || 0}` });
            if (onSuccess) onSuccess();
            setFile(null);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error: any) {
            console.error(error);
            setNotification({ type: "error", message: error?.response?.data?.message || "Bulk upload failed" });
        } finally {
            setLoading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
            const droppedFile = droppedFiles[0];
            // Validate extension
            if (droppedFile.name.match(/\.(csv|xlsx|xls)$/)) {
                setFile(droppedFile);
            } else {
                setNotification({ type: "error", message: "Invalid file type. Please upload csv, xlsx or xls." });
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-60"><LoadingSpinner /></div>;

    return (
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl space-y-6 h-full">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                    <Upload className="w-5 h-5 text-primary" />
                    Bulk Upload MCQs
                </h2>
                <p className="text-muted-foreground text-sm">Upload a CSV or Excel file to import multiple questions at once.</p>
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>

                <div
                    className={`
                border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ease-in-out cursor-pointer
                flex flex-col items-center justify-center min-h-[250px]
                ${isDragOver
                            ? "border-primary bg-primary/10 scale-[1.02]"
                            : "border-border/50 bg-card/30 hover:border-primary/50 hover:bg-card/50"
                        }
            `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                    />

                    {!file ? (
                        <>
                            <div className="bg-primary/10 p-5 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="w-10 h-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <p className="font-semibold text-lg text-foreground">
                                    Click to upload <span className="text-muted-foreground font-normal">or drag and drop</span>
                                </p>
                                <p className="text-xs text-muted-foreground font-mono bg-muted/50 py-1 px-2 rounded">
                                    CSV, XLS, XLSX (MAX. 10MB)
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                            <div className="bg-green-500/10 p-5 rounded-full">
                                <FileText className="w-10 h-10 text-green-500" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-lg text-foreground break-all max-w-[300px]">{file.name}</p>
                                <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                            >
                                Remove
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {!topicId && (
                        <div className="flex items-center gap-2 text-amber-500 text-sm bg-amber-500/10 px-3 py-2 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            <span>Please select a Topic ID above</span>
                        </div>
                    )}
                    <div className="flex gap-3 w-full sm:w-auto ml-auto">
                        <Button type="button" variant="outline" onClick={() => setFile(null)}>
                            Clear
                        </Button>
                        <Button type="submit" disabled={!file || !topicId} className="min-w-[120px]">
                            {loading ? <LoadingSpinner /> : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" /> Upload File
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>

            {notification && (
                <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
            )}
        </div>
    );
}
