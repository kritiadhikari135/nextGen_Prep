import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileDown, CheckCircle } from "lucide-react";
import { mcqApi } from "@/api/mcq";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";
import { toast } from "sonner";

interface BulkUploadTabProps {
    topicId: number | null;
}

export default function BulkUploadTab({ topicId }: BulkUploadTabProps) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topicId) {
            toast.error("Please select a topic first");
            return;
        }
        if (!file) {
            toast.error("Please select a file to upload");
            return;
        }

        setLoading(true);
        try {
            const res = await mcqApi.bulkUploadPractice(topicId as number, file);
            toast.success(`Successfully uploaded ${res.inserted || 0} MCQs`);
            setFile(null);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Bulk upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-4">
                        <Upload className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Bulk Upload Practice MCQs</h2>
                    <p className="text-gray-500 mt-2">Upload a CSV or Excel file containing multiple questions to add them in bulk.</p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50/10 transition-colors cursor-pointer relative">
                        <input
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {file ? (
                            <div className="flex flex-col items-center text-green-600">
                                <CheckCircle className="h-10 w-10 mb-2" />
                                <span className="font-medium text-gray-900">{file.name}</span>
                                <span className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-gray-500">
                                <FileDown className="h-10 w-10 mb-2 text-gray-400" />
                                <span className="font-medium text-gray-700">Click to upload file</span>
                                <span className="text-sm">or drag and drop here</span>
                                <span className="text-xs mt-2 text-gray-400">Supported: .csv, .xlsx</span>
                            </div>
                        )}
                    </div>

                    <Button 
                    type="submit" className="w-full bg-blue-600 hover:bg-blue-700"
                     disabled={loading || !file}>
                        {loading ? (<span className="flex items-center gap-2">
                            <div className="h-4 w-4">
                                 <LoadingSpinner />
                                   </div> Uploading... </span> ) : ("Upload Questions" )}</Button>

                    <div className="text-center">
                        <Button variant="link" className="text-sm text-blue-600">
                            Download Sample Template
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
