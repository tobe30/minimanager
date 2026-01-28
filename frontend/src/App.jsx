import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import CalendarPage from "./pages/CalendarPage";
import Analytics from "./pages/Analytics";
import RegisterForm from "./pages/Register";
import LoginForm from "./pages/Login";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "./lib/api";

const App = () => {


  const { data: authUser } = useQuery({
  queryKey: ["authUser"],
  queryFn: getAuthUser,
  staleTime: 1000 * 60 * 60, // 1 hour
  refetchOnWindowFocus: false,
});

  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
         <Route path="/login" element={!authUser ? <LoginForm /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!authUser ? <RegisterForm /> : <Navigate to="/dashboard" replace />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Route>
      </Routes>

      <Toaster />
    </>
  );
};

export default App;
