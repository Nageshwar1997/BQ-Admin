import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load route components
const Main = lazy(() => import("../pages/main/Main"));

import Home from "../pages/home/Home";
import LoginRedirect from "./LoginRedirect";
import NotFound from "../pages/error/NotFound";
import LoadingScreen from "../components/ui/loaders/LoadingScreen";
import PrivateRoute from "./PrivateRoute";
import AllProducts from "../pages/products/children/AllProducts";
import UploadProduct from "../pages/products/children/UploadProduct";
import Products from "../pages/products/Products";
import UpdateProduct from "../pages/products/children/UpdateProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <PrivateRoute>
          <Main />
        </PrivateRoute>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
        children: [
          {
            index: true,
            element: <AllProducts />,
          },
          {
            path: "upload",
            element: <UploadProduct />,
          },
          {
            path: "update/:id",
            element: <UpdateProduct />,
          },
        ],
      },
    ],
  },
  {
    path: "login",
    element: <LoginRedirect />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
