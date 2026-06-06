import { useState } from "react";
import { useAppDispatch } from "../../../redux/hooks/reduxHooks";
import { loginUser, getCurrentUser } from "../../../redux/features/auth/authSlice";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ username, password })).unwrap();
      await dispatch(getCurrentUser()).unwrap();

      toast.success("Login successful");
    } catch (error) {
      toast.error("Login failed");
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>

        <input
          className={styles.input}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <div>
          <button className={styles.button} onClick={handleLogin}>
            Login
          </button>
        </div>

        <p className={styles.link}>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}