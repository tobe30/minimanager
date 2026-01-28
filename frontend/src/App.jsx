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

const App = () => {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />

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
