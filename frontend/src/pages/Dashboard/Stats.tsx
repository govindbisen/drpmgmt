import styles from "./Dashboard.module.css";

function Stats({ numberOfBlogs }: { numberOfBlogs: number }) {
    return (
        <div className={styles.statsGrid}>
            <div className={styles.statCard}>
                <span>
                    Total Blogs
                </span>
                <h2>
                    {numberOfBlogs}
                </h2>
            </div>
            <div className={styles.statCard}>
                <span>
                    Total Views
                </span>
                <h2>
                    12.4K
                </h2>
            </div>
            <div className={styles.statCard}>
                <span>
                    Total Likes
                </span>
                <h2>
                    3.8K
                </h2>
            </div>
            <div className={styles.statCard}>
                <span>
                    Followers
                </span>
                <h2>
                    1.2K
                </h2>
            </div>
        </div>
    )
}

export default Stats