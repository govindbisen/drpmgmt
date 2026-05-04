import { useState } from "react";
import { useAppDispatch } from "../redux/hooks/reduxHooks";
import { loginUser } from "../redux/features/auth/authSlice";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";

export default function Login() {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        <input className={styles.input} onChange={e => setUsername(e.target.value)} />
        <input className={styles.input} type="password" onChange={e => setPassword(e.target.value)} />
        <div>
          <button className={styles.button} onClick={() => dispatch(loginUser({ username, password }))}>
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