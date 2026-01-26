import { useState, useEffect } from "react";
import { mockTestsApi, MockTest } from "@/api/mock-tests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Clipboard,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function MockTestManager() {
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [testTitle, setTestTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch mock tests
  const fetchMockTests = async () => {
    try {
      setIsLoading(true);
      const data = await mockTestsApi.getAll();
      setMockTests(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch mock tests";
      toast.error(message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMockTests();
  }, []);

  const resetForm = () => {
    setTestTitle("");
    setSelectedFile(null);
    setEditingId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (CSV, Excel, JSON, etc.)
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/json",
      ];

      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid file (CSV, XLS, XLSX, or JSON)");
        setSelectedFile(null);
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!testTitle.trim()) {
      toast.error("Mock test title is required");
      return;
    }

    if (editingId === null && !selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId !== null) {
        // Update title only
        await mockTestsApi.update(editingId, { title: testTitle });
        toast.success("Mock test updated successfully");
      } else {
        // Create new mock test with file
        if (!selectedFile) {
          toast.error("File is required for new mock tests");
          return;
        }
        await mockTestsApi.create({ title: testTitle }, selectedFile);
        toast.success("Mock test created successfully");
      }
      resetForm();
      fetchMockTests();
    } catch (error: any) {
      console.error(error);
      const message = error instanceof Error
        ? error.message
        : error?.response?.data?.detail ||
        error?.response?.data?.message ||
        (editingId ? "Failed to update mock test" : "Failed to create mock test");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (test: MockTest) => {
    setEditingId(test.id);
    setTestTitle(test.title);
  };

  const handleDelete = async (id: number) => {
    setIsSubmitting(true);
    try {
      await mockTestsApi.delete(id);
      toast.success("Mock test deleted successfully");
      fetchMockTests();
      setDeleteId(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete mock test";
      toast.error(message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-background p-6 space-y-6">


      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="lg:col-span-1">
          <Card className="border-gray-100 dark:border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                {editingId ? "Edit Mock Test" : "Add New Mock Test"}
              </CardTitle>
              <CardDescription>
                {editingId
                  ? "Update the mock test title"
                  : "Upload a mock test with questions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Mock Test Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="testTitle" className="text-sm font-semibold text-gray-700 dark:text-foreground">
                    Mock Test Title *
                  </Label>
                  <Input
                    id="testTitle"
                    placeholder="Enter mock test title (e.g., Chemistry Mock Test 1)"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    disabled={isSubmitting}
                    className="border-gray-200 dark:border-border/50 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* File Upload */}
                {!editingId && (
                  <div className="space-y-2">
                    <Label htmlFor="file" className="text-sm font-semibold text-gray-700 dark:text-foreground">
                      Select File * (Max 10MB)
                    </Label>
                    <div className="relative">
                      <input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                        accept=".csv,.xlsx,.xls,.json"
                        className="hidden"
                      />
                      <label
                        htmlFor="file"
                        className={`cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 dark:border-border/50 rounded-lg p-4 transition-all ${selectedFile
                          ? "bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700"
                          : "hover:border-gray-300 dark:hover:border-border bg-gray-50 dark:bg-card/30"
                          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <Upload className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
                        <div className="text-sm">
                          {selectedFile ? (
                            <div>
                              <p className="font-medium text-blue-700 dark:text-blue-400">
                                {selectedFile.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-muted-foreground">
                                {(selectedFile.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="font-medium text-gray-700 dark:text-foreground">
                                Click to upload file
                              </p>
                              <p className="text-xs text-gray-500 dark:text-muted-foreground">
                                CSV, XLS, XLSX, or JSON
                              </p>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={
                      !testTitle.trim() ||
                      (editingId === null && !selectedFile) ||
                      isSubmitting
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    {isSubmitting && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    {editingId ? "Update" : "Upload"} Test
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={isSubmitting}
                      className="border-gray-200 dark:border-border/50"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Mock Tests List */}
        <div className="lg:col-span-2">
          <Card className="border-gray-100 dark:border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clipboard className="h-5 w-5 text-blue-600" />
                Mock Tests
              </CardTitle>
              <CardDescription>
                {mockTests.length} test{mockTests.length !== 1 ? "s" : ""} available
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : mockTests.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-muted-foreground">No mock tests uploaded yet</p>
                  <p className="text-xs text-gray-400 dark:text-muted-foreground">
                    Upload your first mock test to get started
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-gray-100 dark:border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-card/50">
                      <TableRow className="border-gray-100 dark:border-border/50 hover:bg-gray-50 dark:hover:bg-card/50">
                        <TableHead className="text-xs font-semibold text-gray-600 dark:text-muted-foreground uppercase tracking-wide">
                          Test Title
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600 dark:text-muted-foreground uppercase tracking-wide">
                          Questions
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600 dark:text-muted-foreground uppercase tracking-wide text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTests.map((test) => (
                        <TableRow
                          key={test.id}
                          className="border-gray-100 dark:border-border/50 hover:bg-gray-50 dark:hover:bg-card/50 transition-colors"
                        >
                          <TableCell className="text-sm font-medium text-gray-900 dark:text-foreground py-3">
                            {test.title}
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 dark:text-muted-foreground py-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300">
                              {test.total_questions || 0} questions
                            </span>
                          </TableCell>
                          <TableCell className="text-right py-3">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(test)}
                                disabled={isSubmitting}
                                className="border-gray-200 dark:border-border/50 text-gray-700 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-card/50 h-8 w-8 p-0"
                                title="Edit test"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeleteId(test.id)}
                                disabled={isSubmitting}
                                className="border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 w-8 p-0"
                                title="Delete test"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Mock Test</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this mock test? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
