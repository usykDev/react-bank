import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AuthRoute from "./context/AuthRoute";
import PrivateRoute from "./context/PrivateRoute";

import WelcomePage from "./container/welcome/index";
import SignupForm from "./container/signup";
import SigninForm from "./container/signin";
import RecoveryForm from "./container/recovery";
import RecoveryConfirmForm from "./container/recovery-confirm";
import SignupConfirmForm from "./container/signup-confirm";
import WalletPage from "./container/balance";
import NotificationPage from "./container/notifications";
import SendPage from "./container/send";
import ReceivePage from "./container/receive";
import TransactionPage from "./container/transaction";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import SettingsPage from "./container/settings";

axios.defaults.baseURL = "http://localhost:4000/";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<AuthRoute element={<WelcomePage />} />} />
          <Route
            path="/signup"
            element={<AuthRoute element={<SignupForm />} />}
          />
          <Route
            path="/signin"
            element={<AuthRoute element={<SigninForm />} />}
          />
          <Route
            path="/recovery"
            element={<AuthRoute element={<RecoveryForm />} />}
          />
          <Route
            path="/recovery-confirm"
            element={<AuthRoute element={<RecoveryConfirmForm />} />}
          />
          <Route
            path="/signup-confirm"
            element={<PrivateRoute element={<SignupConfirmForm />} />}
          />

          <Route
            path="/balance"
            element={<PrivateRoute element={<WalletPage />} />}
          />
          <Route
            path="/settings"
            element={<PrivateRoute element={<SettingsPage />} />}
          />
          <Route
            path="/notifications"
            element={<PrivateRoute element={<NotificationPage />} />}
          />
          <Route
            path="/send"
            element={<PrivateRoute element={<SendPage />} />}
          />
          <Route
            path="/receive"
            element={<PrivateRoute element={<ReceivePage />} />}
          />
          <Route
            path="/transaction"
            element={<PrivateRoute element={<TransactionPage />} />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
