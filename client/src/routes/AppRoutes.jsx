import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import GenerateCourse from "../pages/GenerateCourse";
import Profile from "../pages/Profile";
import MyCourses from "../pages/MyCourses";
import CourseDetails from "../pages/CourseDetails";
import LessonViewer from "../pages/LessonViewer";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public for everyone */}
        <Route path="/" element={<Home />} />
        <Route path="/generate-course" element={<GenerateCourse />} />

        {/* Public-only: redirect authenticated users to /dashboard */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Private: redirect unauthenticated users to /login */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/lesson/:moduleId" element={<LessonViewer />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
