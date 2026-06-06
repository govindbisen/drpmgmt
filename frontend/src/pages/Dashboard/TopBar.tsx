import styles from "./Dashboard.module.css";

const TopBar = () => {
    return (
        <div className={styles.topbar}>
            <div>
                <h1>
                    Welcome Back 👋
                </h1>
                <p>
                    Manage your spiritual
                    blog platform
                </p>
            </div>
            <button
                className={
                    styles.publishButton
                }
            >
                + New Blog
            </button>
        </div>
    )
}

export default TopBar