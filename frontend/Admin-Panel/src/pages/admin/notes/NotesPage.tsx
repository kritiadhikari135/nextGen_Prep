import { useState, useEffect, useRef } from "react";
import { notesApi, Note } from "@/api/notes";
import { topicsApi, Topic } from "@/api/topics";
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
  Loader2,
  FileText,
  Download,
  ChevronDown,
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

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [topicName, setTopicName] = useState("");
  const [topicId, setTopicId] = useState<number | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [topicError, setTopicError] = useState<string>("");

  useEffect(() => {
    fetchTopics();
    fetchSubjects();
    fetchNotes();
  }, []);

  const fetchTopics = async () => {
    const data = await topicsApi.getAll();
    setTopics(data);
  };

  const fetchSubjects = async () => {
    const data = await subjectsApi.getAll();
    setSubjects(data);
  };

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const data = await notesApi.getAll();
      setNotes(data);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTopicName("");
    setTopicId(null);
    setNoteTitle("");
    setSelectedFile(null);
    setEditingId(null);
    setTopicError("");
    setShowTopicDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topicId || !noteTitle.trim()) {
      if (!topicId) {
        setTopicError("Topic is required");
      }
      if (!noteTitle.trim()) {
        toast.error("Title is required");
      }
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await notesApi.update(editingId, { title: noteTitle });
        toast.success("Note updated");
      } else {
        if (!selectedFile) {
          toast.error("File is required");
          return;
        }

        await notesApi.create(
          topicId,
          { title: noteTitle },
          selectedFile
        );
        toast.success("Note uploaded");
      }

      resetForm();
      fetchNotes();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTopicName = (id: number) =>
    topics.find(t => t.id === id)?.name || "—";

  const getSubjectName = (topicId: number) => {
    const topic = topics.find(t => t.id === topicId);
    return subjects.find(s => s.id === topic?.subject_id)?.name || "—";
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

  const handleDownload = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop() || "file";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">

      {/* Header */}
      {/* <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Notes Management</h1>
            <p className="text-gray-500">Add and manage uploaded notes</p>
          </div>
        </div>
      </div> */}

      {/* ADD NOTE (TOP) */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Note" : "Add Note"}</CardTitle>
          <CardDescription>
            Select a topic name from the list and upload notes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">

            <div className="relative">
              <Label>Topic *</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Type to search topics..."
                  value={topicName}
                  onChange={e => handleTopicInputChange(e.target.value)}
                  onFocus={() => setShowTopicDropdown(true)}
                  disabled={editingId !== null}
                  className={topicError ? "border-red-500" : ""}
                />
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
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
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors flex items-center justify-between"
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

            <div>
              <Label>Note Title *</Label>
              <Input
                placeholder="Chapter notes"
                value={noteTitle}
                onChange={e => setNoteTitle(e.target.value)}
              />
            </div>

            {!editingId && (
              <div>
                <Label>Upload File *</Label>
                <Input
                  type="file"
                  onChange={e =>
                    setSelectedFile(e.target.files?.[0] || null)
                  }
                />
              </div>
            )}

            <div className="md:col-span-3 flex gap-2">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingId ? "Update Note" : "Upload Note"}
              </Button>

              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* NOTES LIST (BOTTOM) */}
      <Card>
        <CardHeader>
          <CardTitle>Notes List</CardTitle>
          <CardDescription>{notes.length} total notes</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.map(note => (
                  <TableRow key={note.id}>
                    <TableCell>{note.title}</TableCell>
                    <TableCell>{getTopicName(note.topic_id)}</TableCell>
                    <TableCell>{getSubjectName(note.topic_id)}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDownload(note.file_url)}
                        className="text-purple-600 flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" /> Download
                      </button>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setEditingId(note.id);
                          setNoteTitle(note.title);
                          setTopicId(note.topic_id);
                          setTopicName(getTopicName(note.topic_id));
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => setDeleteId(note.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600"
              onClick={() =>
                deleteId && notesApi.delete(deleteId).then(fetchNotes)
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
