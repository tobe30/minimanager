import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../lib/api";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate:registerMutation, isPending, error} = useMutation({
    mutationFn: signup,
    onSuccess:()=> queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation(formData);
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
            Create your account
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Start managing tasks the smart way
          </p>

 {/* ERROR MESSAGE IF ANY */}
             {error && (
            <div className="mb-4 rounded-lg border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
              <span className="font-medium">Error: </span>
              {error?.response?.data?.error ||
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong. Please try again."}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. john_doe"
                className="input input-bordered w-full rounded-xl"
                required
              />
            </div>

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
              <label className="label">
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
              className="btn bg-blue-500 text-white w-full rounded-xl mt-2"
            >

               {isPending ? (
                       <>
                         <span className="loading loading-spinner loading-xs"></span>
                         Loading...
                       </>
                     ) : (
                       "Create Account"
                     )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
