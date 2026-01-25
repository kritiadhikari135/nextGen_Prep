// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { InputField, TextAreaField, SelectField  } from "@/components/admin/AdminForm";
// import Notification from "@/components/admin/Notification";
// import { Button } from "@/components/ui/button";
// import { useForm } from "@/hooks/useForm";
// import { ArrowLeft } from "lucide-react";
// import { DragDropImageUpload } from "@/components/admin/DragDrogImageUpload";
// import { teamMemberApi } from "@/api/team-member";
// import { LoadingSpinner } from "@/components/admin/LoadingSpinner";

// export default function AddTeam() {
//   const navigate = useNavigate();
//   const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
//   const [submitLoading, setSubmitLoading] = useState(false);

//   const { values, errors, handleChange, handleSubmit, setValues } = useForm({
//     name: "",
//     title: "",
//     role: "",
//     image: null as File | null,
//     bio: "",
//   });

//   const onSubmit = async () => {
//     setSubmitLoading(true);
//     try {
//       // Create FormData object
//       const formData = new FormData();

//       // Append text fields
//       formData.append("name", values.name);
//       formData.append("title", values.title);
//       formData.append("role", values.role)
//       formData.append("bio", values.bio);

//       // Handle image - only append if it's a File
//       if (values.image && values.image instanceof File) {
//         formData.append("image", values.image);
//       }

//       const response = await teamMemberApi.create(formData);

//       if (response.success) {
//         setNotification({ type: "success", message: "Team member added successfully" });
//         setTimeout(() => navigate("/team"), 500);
//       }
//     } catch (error: any) {
//       console.error("Error adding team member:", error.response?.data || error.message);
//       setNotification({
//         type: "error",
//         message: error.response?.data?.message || "Failed to add team member"
//       });
//     } finally {
//       setSubmitLoading(false);
//     }
//   };
//   if (submitLoading) {
//     return (
//       <div className="flex items-center justify-center h-[60vh]">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="max-w-2xl space-y-6">
//         <div className="flex items-center gap-4">
//           <Button variant="ghost" size="icon" onClick={() => navigate("/teams")}>
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">Add Team Member</h1>
//             <p className="text-muted-foreground">Add a new team member</p>
//           </div>
//         </div>

//         <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
//           <InputField
//             label="Name"
//             name="name"
//             value={values.name}
//             onChange={handleChange}
//             error={errors.name}
//             placeholder="John Doe"
//             required
//           />

//           <InputField
//             label="Title"
//             name="title"
//             value={values.title}
//             onChange={handleChange}
//             error={errors.title}
//             placeholder="mm"
//             required
//           />

//           <SelectField
//             label="Role"
//             name="role"
//             value={values.role}
//             onChange={handleChange}
//             error={errors.role}
//             placeholder="Select role"
//             required
//             options={[

              
//               { value: 'Administrator', label: 'Administrator' },
//             ]}
//           />

//           <TextAreaField
//             label="Bio"
//             name="bio"
//             value={values.bio}
//             onChange={handleChange}
//             error={errors.bio}
//             placeholder="mm"
//             rows={4}
//           />

//           <DragDropImageUpload
//             label=" Image"
//             value={values.image}
//             onChange={(value) => setValues({ ...values, image: value })}
//             error={errors.image}
//           />

//           <div className="flex gap-4">
//             <Button type="submit" >
//               Add Team Member
//             </Button>
//             <Button type="button" variant="outline" onClick={() => navigate("/team")}>
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </div>

//       {notification && (
//         <Notification
//           type={notification.type}
//           message={notification.message}
//           onClose={() => setNotification(null)}
//         />
//       )}
//     </>
//   );
// }