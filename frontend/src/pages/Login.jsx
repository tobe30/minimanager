import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../lib/api";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

      const queryClient = useQueryClient();
    const navigate = useNavigate()

    const {mutate:loginMutation, isPending, error} = useMutation({
        mutationFn: login,
        onSuccess: async () => {
        await queryClient.invalidateQueries({queryKey: ['authUser']});
        navigate('/dashboard');
}

    })


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
              M
            </div>
            <span className="text-xl font-bold text-gray-800">
              MiniManager
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="card bg-base-100 shadow-xl p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-center mb-1">
            Welcome back
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Login to continue managing your tasks
          </p>

                   {/* ERROR MESSAGE IF ANY */}
                          {error && (
                <div className="mb-4 rounded-lg border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                  <span className="font-medium"></span>
                  {error?.response?.data?.error ||
                    error?.response?.data?.message ||
                    error.message ||
                    "Something went wrong. Please try again."}
                </div>
              )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input input-bordered w-full rounded-xl"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="label flex justify-between">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input input-bordered w-full rounded-xl"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="btn bg-blue-500 w-full text-white rounded-xl mt-2"
            >
              {isPending ? (
                                                  <>
                                                    <span className="loading loading-spinner loading-xs"></span>
                                                    Signing in...
                                                  </>
                                                ) : (
                                                  "login"
                                                )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
