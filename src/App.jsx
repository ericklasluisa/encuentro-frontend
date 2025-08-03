import React from "react";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import Routes from "./routes/Routes";

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors />
      <Routes />
    </BrowserRouter>
  );
}

export default App;
