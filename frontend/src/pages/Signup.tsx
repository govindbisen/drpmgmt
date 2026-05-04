import { useState } from "react";
import { useAppDispatch } from "../redux/hooks/reduxHooks";
import { registerUser } from "../redux/features/auth/authSlice";
import styles from "./Signup.module.css";
import { Link } from "react-router-dom";


export default function Signup() {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    dispatch(registerUser({ username, password }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Signup</h2>

        <input
          className={styles.input}
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className={styles.input}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.button} onClick={handleSignup}>
          Signup
        </button>
        <p className={styles.link}>
          Don't have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}