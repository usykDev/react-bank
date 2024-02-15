import React, { createContext, useReducer, useContext, useEffect } from "react";
import { saveSession, getSession } from "../script/session";

const AuthContext = createContext();

const initialState = {
  token: null,
  user: null,
};

const ActionTypes = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        token: null,
        user: null,
      };
    default:
      return state;
  }
};

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const session = getSession();
    if (session) {
      dispatch({
        type: ActionTypes.LOGIN,
        payload: { user: session.user, token: session.token },
      });
    }
  }, []);

  const login = (user, token) => {
    saveSession({ user, token });
    dispatch({
      type: ActionTypes.LOGIN,
      payload: { user, token },
    });
  };

  const logout = () => {
    saveSession(null);
    dispatch({
      type: ActionTypes.LOGOUT,
    });
  };

  const authContextData = {
    authState,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
