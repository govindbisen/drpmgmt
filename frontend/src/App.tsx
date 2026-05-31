import { useAppDispatch, useAppSelector } from "./redux/hooks/reduxHooks";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound/NotFound";
import { useEffect } from "react";
import { restoreSession } from "./redux/features/auth/authSlice";

// region Toasti
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  const dispatch = useAppDispatch();


  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  const {
    isAuthenticated,
    loading
  } = useAppSelector(
    state => state.auth
  );

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />


      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={token ? <Dashboard /> : <Login />} /> */}
          <Route path="/"
            element={
              isAuthenticated
                ? <Dashboard />
                : <Login />
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