import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layouts & shared components (can stay normal or lazy)
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LoadingSpinner } from "./admin/LoadingSpinner";


// lazy-loaded admin pages
const Login = lazy(() => import("@/pages/admin/Login"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminNotFound = lazy(() => import("@/pages/admin/AdminNotFound"));

const MCQManager = lazy(() => import("@/pages/admin/mcqs/MCQManager"));
const BulkUpload = lazy(() => import("@/pages/admin/mcqs/BulkUpload"));
const PracticeManager = lazy(() => import("@/pages/admin/practice/PracticeManager"));
const SubjectsPage = lazy(() => import("@/pages/admin/subjects/SubjectsPage"));
const TopicsPage = lazy(() => import("@/pages/admin/topics/TopicsPage"));
const NotesPage = lazy(() => import("@/pages/admin/notes/NotesPage"));

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },

  // Admin area layout (protected)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <AdminNotFound />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "mcqs", element: <MCQManager /> },
      { path: "mcqs/bulk-upload", element: <BulkUpload /> },
      { path: "practice", element: <PracticeManager /> },
      { path: "subjects", element: <SubjectsPage /> },
      { path: "topics", element: <TopicsPage /> },
      { path: "notes", element: <NotesPage /> },
    ],
  },

  // 404 pages
  { path: "*", element: <AdminNotFound /> },
]);

const Navigation = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default Navigation;
