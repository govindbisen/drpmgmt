import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./redux/hooks/reduxHooks";
import { getCurrentUser } from "./redux/features/auth/authSlice";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound/NotFound";

/* Toast */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useAppDispatch();

  const { isAuthenticated, loading, user } = useAppSelector(
    (state) => state.auth
  );


  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);
  if (loading && !user) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <>

      <ToastContainer position="top-right" autoClose={3000} />

      <BrowserRouter>
        <Routes>

          <Route
            path="/"
            element={
              isAuthenticated ? <Dashboard /> : <Login />
            }
          />


          <Route path="/signup" element={<Signup />} />


          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;