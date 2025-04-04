import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load route components
const Main = lazy(() => import("../pages/main/Main"));

import Home from "../pages/home/Home";
import LoginRedirect from "./LoginRedirect";
import NotFound from "../pages/error/NotFound";
import LoadingScreen from "../components/loaders/LoadingScreen";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Main />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Home />,
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
