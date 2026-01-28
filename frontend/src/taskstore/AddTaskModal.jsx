import { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  MapPin,
  Calendar,
  Clock,
  Flag,
  Trash2,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, deleteSite, getSite, updateTask } from "../lib/api";
import  toast  from "react-hot-toast";


const AddTaskModal = ({ isOpen, onClose, editingTask }) => {
  const queryClient = useQueryClient();

  //addtask
    const { mutate: addTask, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast.success("Task added successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred during onboarding");
    }
  });

  //get site
const { data: sites = [] } = useQuery({
  queryKey: ["sites"],
  queryFn: getSite,
});

// console.log(sites)

//delete site

const deleteMutation = useMutation({
  mutationFn: deleteSite,
   onSuccess: () => {
      queryClient.invalidateQueries(["sites"]);
      toast.success("site deleted successfully");
    },
    onError: (err) => 
      toast.error(err.response?.data?.message || "Failed to delete site"),
})


//updatetask
const updateMutation = useMutation({
  mutationFn: (payload) => updateTask(payload),
  onSuccess: () => {
    queryClient.invalidateQueries(["tasks"]);
    toast.success("Task updated successfully!");
    onClose();
    resetForm();
  },
  onError: (err) =>
    toast.error(err.response?.data?.message || "Failed to update task"),
});

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [siteId, setSiteId] = useState("");
  const [siteSearch, setSiteSearch] = useState("");
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);

  const siteInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(siteSearch.toLowerCase())
  );

  const exactMatch = sites.find(
    (site) => site.name.toLowerCase() === siteSearch.toLowerCase()
  );

  /* ---------------- EFFECTS ---------------- */

useEffect(() => {
  if (!isOpen) return;

  if (editingTask) {
    setTitle(editingTask.title);
    setPriority(editingTask.priority);

    if (editingTask.dueAt) {
      const due = new Date(editingTask.dueAt);
      setDueDate(due.toISOString().split("T")[0]);
      setDueTime(due.toTimeString().slice(0, 5));
    } else {
      setDueDate("");
      setDueTime("");
    }

    // ✅ FIXED SITE LOGIC
    if (editingTask.site) {
      setSiteId(editingTask.site._id);
      setSiteSearch(editingTask.site.name);
    } else {
      setSiteId("");
      setSiteSearch("");
    }

  } else {
    resetForm();
  }
}, [editingTask, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !siteInputRef.current?.contains(e.target)
      ) {
        setShowSiteDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- HELPERS ---------------- */

  const resetForm = () => {
    setTitle("");
    setPriority("medium");
    setDueDate("");
    setDueTime("");
    setSiteId("");
    setSiteSearch("");
  };

  const handleSelectSite = (site) => {
    setSiteId(site._id);
    setSiteSearch(site.name);
    setShowSiteDropdown(false);
  };

const handleCreateSite = () => {
  if (siteSearch.trim() && !exactMatch) {
    setSiteId(""); // clear siteId since it's a new site
    setShowSiteDropdown(false); // close dropdown
  }
};




const handleDeleteSite = (e, siteIdToDelete) => {
  e.stopPropagation();
  deleteMutation.mutate(siteIdToDelete);

  if (siteId === siteIdToDelete) {
    setSiteId("");
    setSiteSearch("");
  }
};


const handleSubmit = (e) => {
  e.preventDefault();
   if (!title.trim()) return;

if (editingTask) {
  updateMutation.mutate({
    taskId: editingTask._id,
    data: {
      title: title.trim(),
      priority,
      dueAt: dueDate ? new Date(`${dueDate} ${dueTime || "00:00"}`).toISOString() : undefined,
      siteName: siteSearch.trim() || undefined, // <-- change here
      completed: editingTask.completed,
      status: editingTask.status,
    },
  });
}
 else {
    // Add task via TanStack mutation
    
  const isExistingSite = sites.some(
    (site) => site._id === siteId
  );

    const payload = {
      title: title.trim(),
      priority,
      siteId,
      dueAt: dueDate
        ? new Date(`${dueDate} ${dueTime || "00:00"}`).toISOString()
        : undefined,
      status: "pending",
      completed: false,
    };

    if (isExistingSite) {
    payload.siteId = siteId; // existing site
  } else {
    payload.newSiteName = siteSearch.trim(); //new site
  }

    addTask(payload); // call your backend mutation
  }

  onClose();
  resetForm();
};

 const blueInput =
  `
  hover:border-blue-500
  focus:border-blue-500
  focus:ring-2
  focus:ring-blue-500
  focus:ring-offset-0
  focus:outline-none
  focus-visible:outline-none
  `;



  if (!isOpen) return null;

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-base-100 rounded-2xl shadow-2xl border border-base-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold">
            {editingTask ? "Edit Task" : "Quick Add Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-base-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className={`input input-bordered w-full text-lg ${blueInput}`}
            autoFocus
          />

          {/* Site */}
          <div className="relative">
            <div
   className="
    flex items-center gap-2
    input input-bordered w-full
    hover:border-blue-500
    focus-within:border-blue-500
    focus-within:ring-2
    focus-within:ring-blue-500
    focus-within:ring-offset-0
    focus-within:outline-none
  "
>

              <MapPin className="w-5 h-5 opacity-60" />
              <input
                ref={siteInputRef}
                value={siteSearch}
                onChange={(e) => {
                  setSiteSearch(e.target.value);
                  setShowSiteDropdown(true);
                  if (!e.target.value) setSiteId("");
                }}
                onFocus={() => setShowSiteDropdown(true)}
                placeholder="Search or create site..."
                className="flex-1 bg-transparent outline-none"
              />
              {siteSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setSiteSearch("");
                    setSiteId("");
                  }}
                >
                  <X className="w-4 h-4 opacity-60" />
                </button>
              )}
            </div>

            {showSiteDropdown && (
              <div
                ref={dropdownRef}
                className="absolute z-50 mt-1 w-full bg-base-100 border border-base-300 rounded-xl shadow"
              >
                {filteredSites.map((site) => (
                  <div
                    key={site._id}
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-base-200 ${
                      siteId === site._id ? "bg-primary/10" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectSite(site)}
                      className="flex-1 text-left"
                    >
                      {site.name}
                    </button>
                    <button
  type="button"
  onClick={(e) => handleDeleteSite(e, site._id)}
  className="p-1 hover:bg-error/10 rounded"
>
  <Trash2 className="w-4 h-4 text-error" />
</button>

                  </div>
                ))}

                {siteSearch.trim() && !exactMatch && (
                  <button
                    type="button"
                    onClick={handleCreateSite}
                    className="w-full px-4 py-2 flex items-center gap-2 text-primary border-t"
                  >
                    <Plus className="w-4 h-4" />
                    Create "{siteSearch}"
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Date & Time */}
          <div className="flex gap-3">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`input input-bordered w-full ${blueInput}`}
            />
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className={`input input-bordered w-full ${blueInput}`}
            />
          </div>

          {/* Priority */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flag className="w-4 h-4 opacity-60" />
              <span className="text-sm font-medium">Priority</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPriority("high")}
                className={`flex-1 btn border border-gray-300 ${
                  priority === "high"
                    ? "btn-error"
                    : "btn-outline"
                }`}
              >
                High
              </button>

              <button
                type="button"
                onClick={() => setPriority("medium")}
                className={`flex-1 btn border border-gray-300 ${
                  priority === "medium"
                    ? "btn-warning"
                    : "btn-outline"
                }`}
              >
                Medium
              </button>

              <button
                type="button"
                onClick={() => setPriority("low")}
                className={`flex-1 btn border border-gray-300 ${
                  priority === "low"
                    ? "btn-success"
                    : "btn-outline"
                }`}
              >
                Low
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn  flex-1"
            >
              Cancel
            </button>
           <button
  type="submit"
  disabled={!title.trim() || (!siteId && !siteSearch.trim()) || isPending}
  className="btn bg-blue-500 text-white flex-1"
>
  {isPending ? "Adding..." : editingTask ? "Save" : "Add Task"}
</button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
