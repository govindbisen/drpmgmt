import { useEffect, useState } from "react";
import {
  fetchBlogs,
  createBlog,
  updateBlog,
  uploadBlogImage,
  deleteBlog,
} from "../redux/features/blog/blogSlice";

import { logoutUser } from "../redux/features/auth/authSlice";

import {
  useAppDispatch,
  useAppSelector
} from "../redux/hooks/reduxHooks";
import { logout } from "../redux/features/auth/authSlice";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { blogs } = useAppSelector(
    state => state.blog
  );

  console.log(blogs)

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, []);


  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "NEW_BLOG") {
        alert("New Blog: " + data.title);
      }
    };

    return () => socket.close();
  }, []);

  const handleCreate = async () => {
    if (!title || !content) return;

    const res: any = await dispatch(
      createBlog({
        title,
        content,
      })
    );

    const blogId = res.payload.id;

    if (image) {
      await dispatch(
        uploadBlogImage({
          blogId,
          file: image,
        })
      );
    }

    setTitle("");
    setContent("");
    setImage(null);

    dispatch(fetchBlogs());
  };

  const startEdit = (blog: any) => {
    setEditingId(blog.id);
    setEditTitle(blog.title);
    setEditContent(blog.content);
    setEditImage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
    setEditImage(null);
  };

  const saveEdit = async (id: number) => {
    await dispatch(
      updateBlog({
        id,
        title: editTitle,
        content: editContent,
        category: "spiritual",
      })
    );

    if (editImage) {
      await dispatch(
        uploadBlogImage({
          blogId: id,
          file: editImage,
        })
      );
    }

    setEditingId(null);
    setEditTitle("");
    setEditContent("");
    setEditImage(null);

    dispatch(fetchBlogs());
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  return (
    <div className={styles.dashboard}>
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

      {/* ======================
          MAIN
      ====================== */}

      <main className={styles.main}>

        {/* TOPBAR */}

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

        {/* ======================
            STATS
        ====================== */}

        <div className={styles.statsGrid}>

          <div className={styles.statCard}>

            <span>
              Total Blogs
            </span>

            <h2>
              {blogs.length}
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

        {/* ======================
            CREATE BLOG
        ====================== */}

        <div className={styles.createSection}>
          <div className={styles.sectionHeader}>

            <h2>
              Create New Blog
            </h2>

            <p>
              Share your spiritual
              experiences
            </p>

          </div>

          <div className={styles.form}>

            <input
              className={
                styles.input
              }
              placeholder="Enter blog title"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
            />

            <textarea
              className={
                styles.textarea
              }
              placeholder="Write your blog content..."
              value={content}
              onChange={(e) =>
                setContent(
                  e.target.value
                )
              }
            />

            <div
              className={
                styles.formBottom
              }
            >

              <label
                className={
                  styles.uploadButton
                }
              >

                📷 Upload Image

                <input
                  hidden
                  type="file"
                  onChange={(e) =>
                    setImage(
                      e.target
                        .files?.[0] ||
                      null
                    )
                  }
                />

              </label>

              <button
                className={
                  styles.createButton
                }
                onClick={
                  handleCreate
                }
              >
                Publish Blog
              </button>

            </div>

          </div>

        </div>

        {/* ======================
            BLOGS
        ====================== */}

        <div className={styles.blogSection}>

          <div className={styles.sectionHeader}>

            <h2>
              Latest Blogs
            </h2>

            <p>
              Recently published blogs
            </p>

          </div>

          <div className={styles.blogGrid}>

            {blogs.map((b) => (

              <div
                key={b.id}
                className={
                  styles.blogCard
                }
              >

                {/* IMAGE */}

                {b.image && (
                  <img
                    className={
                      styles.blogImage
                    }
                    src={`http://localhost:8000/${b.image}`}
                    alt={b.title}
                  />

                )}

                <div
                  className={
                    styles.blogContent
                  }
                >

                  <div
                    className={
                      styles.blogTop
                    }
                  >
                    <span
                      className={
                        styles.category
                      }
                    >
                      Spiritual
                    </span>
                    <span
                      className={
                        styles.views
                      }
                    >
                      👁 1.2K
                    </span>

                  </div>

                  {editingId ===
                    b.id ? (

                    <div
                      className={
                        styles.editSection
                      }
                    >
                      <input
                        className={
                          styles.editInput
                        }
                        value={
                          editTitle
                        }
                        onChange={(e) =>
                          setEditTitle(
                            e.target
                              .value
                          )
                        }
                      />
                      <textarea
                        className={
                          styles.editTextarea
                        }
                        value={
                          editContent
                        }
                        onChange={(e) =>
                          setEditContent(
                            e.target
                              .value
                          )
                        }
                      />
                      <label
                        className={
                          styles.uploadButton
                        }
                      >

                        📷 Change Image
                        <input
                          hidden
                          type="file"
                          onChange={(e) =>
                            setEditImage(
                              e.target
                                .files?.[0] ||
                              null
                            )
                          }
                        />
                      </label>
                      <div
                        className={
                          styles.editActions
                        }
                      >
                        <button
                          className={
                            styles.saveBtn
                          }
                          onClick={() =>
                            saveEdit(
                              b.id
                            )
                          }
                        >
                          ✅ Save
                        </button>

                        <button
                          className={
                            styles.cancelBtn
                          }
                          onClick={
                            cancelEdit
                          }
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (

                    <>
                      <h3>
                        {b.title}
                      </h3>
                      <p>
                        {b.content}
                      </p>
                    </>
                  )}

                  {/* FOOTER */}
                  <div
                    className={
                      styles.blogFooter
                    }
                  >
                    <div
                      className={
                        styles.authorSection
                      }
                    >
                      <div
                        className={
                          styles.authorAvatar
                        }
                      >
                        {b.username
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div
                          className={
                            styles.authorName
                          }
                        >
                          {b.username}
                        </div>
                        <div
                          className={
                            styles.postDate
                          }
                        >
                          2 days ago
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        styles.actions
                      }
                    >
                      <button
                        className={
                          styles.editBtn
                        }
                        onClick={() =>
                          startEdit(
                            b
                          )
                        }
                      >
                        ✏ Edit
                      </button>
                      <button
                        className={
                          styles.deleteButton
                        }
                        onClick={() =>
                          dispatch(
                            deleteBlog(
                              b.id
                            )
                          )
                        }
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}