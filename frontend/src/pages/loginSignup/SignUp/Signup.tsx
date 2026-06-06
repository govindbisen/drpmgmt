import { useState } from "react";
import { useAppDispatch } from "../../../redux/hooks/reduxHooks";
import { registerUser } from "../../../redux/features/auth/authSlice";
import styles from "./Signup.module.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");



  const handleSignup = async () => {
    try {
      const response: any = await dispatch(
        registerUser({ username, password, email })
      ).unwrap();
      toast.success(response?.message || "Success");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
      );
    }
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
          className={styles.input}
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
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