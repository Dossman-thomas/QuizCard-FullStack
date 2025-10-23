// import react
import React from "react";
import ReactDOM from "react-dom/client";

// import react router
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import css
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/index.css";
import "./styles/variables.css";

// import pages
import App from "./App.jsx";
import Error from "./pages/Error.jsx";
import LandingPage from "./pages/Landing.jsx";
import ManageCardsPage from "./pages/ManageCards.jsx";
import StudyPage from "./pages/StudyMode.jsx";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage />, errorElement: <Error /> },
  {
    element: <App />,
    errorElement: <Error />,
    children: [
      { path: "/manage-cards", element: <ManageCardsPage /> },
      { path: "/study", element: <StudyPage /> },
    ],
  },
]);

// Render the RouterProvider component
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
