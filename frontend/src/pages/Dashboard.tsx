import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks/reduxHooks";
import { fetchBlogs, createBlog, deleteBlog } from "../redux/features/blog/blogSlice";
import { logout } from "../redux/features/auth/authSlice";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { blogs } = useAppSelector(state => state.blog);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const handleCreate = async () => {

    const res: any = await dispatch(createBlog({ title, content }));

    const blogId = res.payload.id;


    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      await fetch(`http://127.0.0.1:8000/blogs/${blogId}/upload-image`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
    }

    // 3️⃣ refresh blogs
    dispatch(fetchBlogs());
  };

  useEffect(() => {
    dispatch(fetchBlogs());
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Dashboard</h2>
        <button className={styles.logout} onClick={() => dispatch(logout())}>
          Logout
        </button>
      </div>

      <div className={styles.form}>
        <input className={styles.input} placeholder="Title" onChange={e => setTitle(e.target.value)} />
        <input className={styles.input} placeholder="Content" onChange={e => setContent(e.target.value)} />
        <label className={styles.fileLabel}>
          Choose Image
          <input
            className={styles.fileInput}
            type="file"
            onChange={e => setImage(e.target.files?.[0] || null)}
            hidden
          />
        </label>

        <button className={styles.button} onClick={handleCreate}>
          Create Blog
        </button>
      </div>

      {blogs.map(b => (
        <div key={b.id} className={styles.blogCard}>
          <div className={styles.blogTitle}>{b.title}</div>
          <p>{b.content}</p>

          {b.image_url && (
            <img
              className={styles.image}
              src={`http://127.0.0.1:8000/${b.image_url}`}
            />
          )}

          <div className={styles.author}>
            — Created by: {b.username}
          </div>

          <button onClick={() => dispatch(deleteBlog(b.id))}>
            Delete
          </button>
        </div>

      ))}


    </div>
  );
}