import styles from "./Dashboard.module.css";

const SideBar = ({ handleLogout }: { handleLogout: () => void }) => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoSection}>
                <div className={styles.logo}>
                    D
                </div>

                <div>

                    <h2>
                        DivineBlog
                    </h2>

                    <p>
                        Creator Dashboard
                    </p>
                </div>
            </div>

            <div className={styles.menu}>
                <div className={styles.menuItemActive}>
                    📊 Dashboard
                </div>

                <div className={styles.menuItem}>
                    ✍ My Blogs
                </div>

                <div className={styles.menuItem}>
                    ❤️ Engagement
                </div>

                <div className={styles.menuItem}>
                    📁 Media
                </div>

                <div className={styles.menuItem}>
                    ⚙ Settings
                </div>

                <div
                    className={styles.logoutButton}
                    onClick={handleLogout}
                >
                    🚪 Logout
                </div>

            </div>

        </aside>
    )
}

export default SideBar