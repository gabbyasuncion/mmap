import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcome from "./routes/Welcome.tsx";
import "@fontsource/inter";
import PlaylistGenerator from "./routes/PlaylistGenerator.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/authorized",
    element: <Welcome />,
  },
  {
    path: "/playlist",
    element: <PlaylistGenerator />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
