import { RouteObject } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Venues from "@/pages/Venues";
import VenueDetail from "@/pages/VenueDetail";
import VenueForm from "@/pages/VenueForm";
import MyVenues from "@/pages/MyVenues";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "venues", element: <Venues /> },
      { path: "venues/:id", element: <VenueDetail /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "profile", element: <Profile /> },
        ],
      },
      {
        element: <RoleProtectedRoute allowedRoles={["VENUE_OWNER", "ADMIN"]} />,
        children: [
          { path: "my-venues", element: <MyVenues /> },
          { path: "venues/new", element: <VenueForm /> },
          { path: "venues/:id/edit", element: <VenueForm /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];