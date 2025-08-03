import React from "react";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import Routes from "./routes/Routes";

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes />
    </BrowserRouter>
  );
}

export default App;
