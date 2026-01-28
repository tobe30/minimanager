import { Menu, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useTaskStore } from "../taskstore/taskStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthUser, logout } from "../lib/api";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { selectedDate, setSelectedDate } = useTaskStore();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

const { data: authUser } = useQuery({
  queryKey: ["authUser"],
  queryFn: getAuthUser,
  staleTime: 1000 * 60 * 60, // 1 hour
  refetchOnWindowFocus: false,
});

//logout
  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/"); // redirect after logout
    },
  });



  const formatDisplayDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toLocalDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

  return (
    <header className="h-16 bg-card border-b border-gray-300 flex items-center justify-between px-4 lg:px-6">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="btn-ghost lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              M
            </span>
          </div>
          <span className="font-semibold text-lg hidden sm:block">
            MiniManager
          </span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <div className="hidden border border-gray-300 px-2 rounded-xl md:flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="date"
            value={toLocalDateInputValue(selectedDate)}
            onChange={(e) =>
              setSelectedDate(new Date(e.target.value))
            }
            className="input-field text-sm py-1.5 w-auto"
          />
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 btn-ghost"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="hidden sm:block text-sm font-medium">
               {authUser.user?.username || "User"}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsProfileOpen(false)}
              />

              <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-lg shadow-lg border border-gray-300 py-2 z-20 animate-fade-in">
               


                <button onClick={logoutMutation} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-muted transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
