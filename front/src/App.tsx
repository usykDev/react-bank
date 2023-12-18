import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./AuthContext";
// import AuthRoute from "./AuthRoute";
import WellcomePage from "./container/welcome-page";
import SignupForm from "./container/signup";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<WellcomePage />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
