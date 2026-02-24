import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Briefcase, NotebookPen, ListTodo, Settings, LogOut, ChevronLeft, ChevronRight, Menu, FolderOpen, Clipboard, FileText } from "lucide-react";
import { useAuth } from "@/context/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Briefcase, label: "Subjects", path: "subjects" },
  { icon: FolderOpen, label: "Topics", path: "/topics" },
  { icon: FileText, label: "Notes", path: "/notes" },
  { icon: ListTodo, label: "Mcqs", path: "/mcqs" },
  { icon: Clipboard, label: "Mock Tests", path: "/practice" },
];

export const AdminSidebar = () => {
  const { logout } = useAuth();
  const [width, setWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setIsCollapsed(true);
      } else {
        setIsMobile(false);
        setIsCollapsed(false);
      }
    };
    handleResize(); // Init
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startResizing = (mouseDownEvent: React.MouseEvent) => {
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      const newWidth = mouseMoveEvent.clientX;
      if (newWidth > 60 && newWidth < 400) {
        setWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setWidth(80); // Min width for icons only
    } else {
      setWidth(250); // Default expanded width
    }
  };

  return (
    <>
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1, width: isCollapsed ? 80 : width }}
        transition={{ duration: 0.2 }} // Faster transition for width
        className={`bg-card/50 backdrop-blur-sm border-r border-border/50 flex flex-col relative group fixed md:relative z-20 md:h-screen ${isMobile && isCollapsed ? '-translate-x-full md:translate-x-0' : ''}`}
        style={{ width: isMobile ? (isCollapsed ? 0 : '100%') : (isCollapsed ? 80 : width) }}
      >
        <div className={`p-6 border-b border-border/50 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent whitespace-nowrap overflow-hidden">
              Admin Panel
            </h1>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsCollapsed(true)}>
            <ChevronLeft />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-x-hidden">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setIsCollapsed(true)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 whitespace-nowrap overflow-hidden ${isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                } ${isCollapsed ? 'justify-center' : ''}`
              }
              title={isCollapsed ? item.label : ""}
            >
              <item.icon className={`h-5 w-5 flex-shrink-0`} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          <button
            onClick={logout}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>

        {/* Resizer Handle (Desktop only) */}
        {!isMobile && !isCollapsed && (
          <div
            className="w-1 bg-border/0 hover:bg-primary/50 absolute right-0 top-0 bottom-0 cursor-ew-resize transition-colors"
            onMouseDown={startResizing}
          />
        )}

        {/* Toggle Button for Desktop */}
        {!isMobile && (
          <div className="absolute -right-3 top-10 z-50">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-full shadow-md bg-card border-border"
              onClick={toggleCollapse}
            >
              {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </Button>
          </div>
        )}
      </motion.aside>

      {/* Mobile Menu Toggle (When sidebar is hidden/collapsed on mobile) */}
      {isMobile && isCollapsed && (
        <div className="fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon" onClick={() => setIsCollapsed(false)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}
    </>
  );
};
