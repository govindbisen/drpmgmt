import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.errorCode}>
                    <span>4</span>
                    <span className={styles.zero}>0</span>
                    <span>4</span>
                </div>

                <h2 className={styles.title}>
                    Lost in Cyberspace
                </h2>

                <p className={styles.description}>
                    The page you're looking for doesn't exist or has been moved.
                    Let's get you back on track.
                </p>

                <Link to="/" className={styles.button}>
                    🚀 Return Home
                </Link>
            </div>
        </div>
    );
}