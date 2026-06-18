import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Drops from "../pages/Drops";
import Users from "../pages/Users";
import Purchases from "../pages/Purchases";
import { AllSneakerDrops } from "../pages/drops/AllSneakerDrops";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/drops", element: <Drops /> },
      { path: "/live", element: <AllSneakerDrops /> },
      { path: "/users", element: <Users /> },
      { path: "/purchases", element: <Purchases /> },
    ],
  },
]);
