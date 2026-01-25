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

const ServiceList = lazy(() => import("@/pages/admin/service/ServiceList"));
const EditService = lazy(() => import("@/pages/admin/service/EditService"));
const AddService = lazy(() => import("@/pages/admin/service/AddService"));

const ProjectsList = lazy(() => import("@/pages/admin/projects/ProjectsList"));
const EditProject = lazy(() => import("@/pages/admin/projects/EditProject"));
const AddProject = lazy(() => import("@/pages/admin/projects/AddProject"));

const TeamList = lazy(() => import("@/pages/admin/team/TeamList"));
const EditTeam = lazy(() => import("@/pages/admin/team/EditTeam"));
const AddTeam = lazy(() => import("@/pages/admin/team/AddTeam"));

const MessageList = lazy(() => import("@/pages/admin/message/MessageList"));
const MessageDetails = lazy(
  () => import("@/pages/admin/message/MessageDetails"),
);

const Profile = lazy(() => import("@/pages/admin/settings/Profile"));
const ChangePassword = lazy(
  () => import("@/pages/admin/settings/ChangePassword"),
);
const ForgetPassword = lazy(
  () => import("@/pages/admin/settings/ForgetPassword"),
);

const TestimonialsList = lazy(
  () => import("@/pages/admin/testimonials/TestimonialsList"),
);
const EditTestimonials = lazy(
  () => import("@/pages/admin/testimonials/EditTestimonials"),
);
const AddTestimonials = lazy(
  () => import("@/pages/admin/testimonials/AddTestimonials"),
);
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
      { path: "service", element: <ServiceList /> },
      { path: "service/edit/:id", element: <EditService /> },
      { path: "service/add", element: <AddService /> },
      { path: "projects", element: <ProjectsList /> },
      { path: "projects/edit/:id", element: <EditProject /> },
      { path: "projects/add", element: <AddProject /> },
      { path: "team", element: <TeamList /> },
      { path: "team/edit/:id", element: <EditTeam /> },
      { path: "team/add", element: <AddTeam /> },
      { path: "message", element: <MessageList /> },
      { path: "message/details/:id", element: <MessageDetails /> },
      { path: "settings/profile", element: <Profile /> },
      { path: "settings/password", element: <ChangePassword /> },
      { path: "settings/forgetpassword", element: <ForgetPassword /> },
      { path: "testimonials", element: <TestimonialsList /> },
      { path: "testimonials/add", element: <AddTestimonials /> },
      { path: "testimonials/edit/:id", element: <EditTestimonials /> },
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
