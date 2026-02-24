import { useState, useEffect } from "react";
import { subjectsApi, Subject } from "@/api/subjects";
import { topicsApi, Topic } from "@/api/topics";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [topicName, setTopicName] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchSubjects = async () => {
    try {
      setSubjectsLoading(true);
      const data = await subjectsApi.getAll();
     setSubjects(Array.isArray(data) ? data : []);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch subjects";
      toast.error(message);
    } finally {
      setSubjectsLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      setIsLoading(true);
      const data = await topicsApi.getAll();
   setTopics(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch topics";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchTopics();
  }, []);

  const resetForm = () => {
    setTopicName("");
    setSelectedSubject("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSubject || !topicName.trim()) {
      toast.error("Subject and topic name are required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId !== null) {
        await topicsApi.update(editingId, { name: topicName });
        toast.success("Topic updated successfully");
      } else {
        await topicsApi.create(Number(selectedSubject), { name: topicName });
        toast.success("Topic created successfully");
      }
      resetForm();
      fetchTopics();
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (topic: Topic) => {
    setEditingId(topic.id);
    setTopicName(topic.name);
    setSelectedSubject(topic.subject_id.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await topicsApi.delete(deleteId);
      toast.success("Topic deleted successfully");
      fetchTopics();
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    } finally {
      setDeleteId(null);
    }
  };

  const getSubjectName = (id: number) =>
    subjects.find((s) => s.id === id)?.name || "-";

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6 lg:p-8">

      {/* TOP FORM */}
      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            {editingId ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
            {editingId ? "Edit Topic" : "Add New Topic"}
          </CardTitle>
          <CardDescription>
            Create and manage topics under subjects
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-4 items-end"
          >
            <div className="space-y-2">
              <Label>Subject *</Label>
              {subjectsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                  disabled={editingId !== null}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Topic Name *</Label>
              <Input
                placeholder="e.g. Algebra Basics"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving
                  </>
                ) : editingId ? "Update" : "Add"}
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

      {/* TOPICS LIST */}
      <Card className="shadow-md">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Topics</CardTitle>
              <CardDescription>
                List of all topics
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
                <TableHead>ID</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : topics.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    No topics found
                  </TableCell>
                </TableRow>
              ) : (
                topics.map((topic) => (
                  <TableRow key={topic.id} className="group hover:bg-gray-50/50">
                    <TableCell className="font-mono text-xs">#{topic.id}</TableCell>
                    <TableCell className="font-medium">{topic.name}</TableCell>
                    <TableCell>{getSubjectName(topic.subject_id)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(topic)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteId(topic.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* DELETE CONFIRM */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Topic?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
