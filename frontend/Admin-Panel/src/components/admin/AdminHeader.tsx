// import { useAuth } from "@/hooks/useAuth";
import { User, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { useTheme } from "@/context/ThemeContext";

export const AdminHeader = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome back, {user?.name || "Admin"}!</h2>
          {user?.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-purple-400 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-semibold">Profile</DropdownMenuLabel>


              {/* Theme Toggle */}
              <div className="px-2 py-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Theme</p>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (theme === "dark") toggleTheme();
                    }}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    <span className="text-xs">Light</span>
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (theme === "light") toggleTheme();
                    }}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    <span className="text-xs">Dark</span>
                  </Button>
                </div>
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
