import { useEffect, useState } from "react";
import {
  fetchBlogs,
  createBlog,
  updateBlog,
  uploadBlogImage,
  deleteBlog,
} from "../../redux/features/blog/blogSlice";

import { logoutUser } from "../../redux/features/auth/authSlice";

import {
  useAppDispatch,
  useAppSelector
} from "../../redux/hooks/reduxHooks";

import styles from "./Dashboard.module.css";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import Stats from "./Stats";
import CreateBlog from "./CreateBlog";
import BlogList from "./BlogList";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { blogs } = useAppSelector(
    state => state.blog
  );

  console.log(blogs)

  // useEffect(() => {
  //   const socket = new WebSocket(`ws://localhost:8000/ws${userId}`);

  //   socket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);

  //     if (data.type === "NEW_BLOG") {
  //       alert("New Blog: " + data.title);
  //     }
  //   };

  //   return () => socket.close();
  // }, []);


  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);


  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  return (
    <div className={styles.dashboard}>
      <SideBar handleLogout={handleLogout} />
      <main className={styles.main}>
        <TopBar />
        <Stats numberOfBlogs={blogs ? blogs.length : 0} />

        {/* #Region Create Blog */}
        <CreateBlog />
        {/* ======================
            BLOGS
        ====================== */}

        <BlogList blogs={blogs || []} />

      </main>
    </div>
  );
}  