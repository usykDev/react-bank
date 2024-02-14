import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingSpinner from "../loading";

const PrivateRoute = ({ element }) => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 50));
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return authState.token && authState.user ? element : <Navigate to="/" />;
};

export default PrivateRoute;
