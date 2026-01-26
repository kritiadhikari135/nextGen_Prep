import { useState, useEffect } from "react";
import { subjectsApi, Subject } from "@/api/subjects";
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
    Plus,
    Loader2,
    BookOpen,
    AlertCircle,
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

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const fetchSubjects = async () => {
        try {
            setIsLoading(true);
            const data = await subjectsApi.getAll();
            setSubjects(data);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to fetch subjects";
            toast.error(message);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const resetForm = () => {
        setFormData({ name: "", description: "" });
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Subject name is required");
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingId !== null) {
                await subjectsApi.update(editingId, formData);
                toast.success("Subject updated successfully");
            } else {
                await subjectsApi.create(formData);
                toast.success("Subject created successfully");
            }
            resetForm();
            fetchSubjects();
        } catch (error) {
            const message = error instanceof Error ? error.message : "An error occurred";
            toast.error(message);
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (subject: Subject) => {
        setFormData({
            name: subject.name,
            description: subject.description,
        });
        setEditingId(subject.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async () => {
        if (deleteId === null) return;

        try {
            await subjectsApi.delete(deleteId);
            toast.success("Subject deleted successfully");
            fetchSubjects();
        } catch (error) {
            const message = error instanceof Error ? error.message : "An error occurred";
            toast.error(message);
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6 lg:p-8">

            {/* TOP: ADD / EDIT SUBJECT */}
            <Card className="shadow-lg border-t-4 border-t-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        {editingId ? (
                            <Pencil className="w-5 h-5 text-primary" />
                        ) : (
                            <Plus className="w-5 h-5 text-primary" />
                        )}
                        {editingId ? "Edit Subject" : "Add New Subject"}
                    </CardTitle>
                    <CardDescription>
                        Add or update subjects quickly
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-4 md:grid-cols-4 items-end"
                    >
                        <div className="space-y-2">
                            <Label>
                                Subject Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="Mathematics"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label>Description</Label>
                            <Input
                                placeholder="Optional description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving
                                    </>
                                ) : editingId ? (
                                    "Update"
                                ) : (
                                    "Add"
                                )}
                            </Button>

                            {editingId && (
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* BOTTOM: SUBJECT LIST */}
            <Card className="shadow-md">
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Subjects</CardTitle>
                            <CardDescription>
                                All available subjects
                            </CardDescription>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full">
                            <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right w-[120px]">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : subjects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <AlertCircle className="w-8 h-8" />
                                            No subjects found
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subjects.map((subject) => (
                                    <TableRow key={subject.id} className="group">
                                        <TableCell className="font-mono text-xs">
                                            #{subject.id}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {subject.name}
                                        </TableCell>
                                        <TableCell className="truncate max-w-[400px]">
                                            {subject.description || "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(subject)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteId(subject.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* DELETE CONFIRMATION */}
            <AlertDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
