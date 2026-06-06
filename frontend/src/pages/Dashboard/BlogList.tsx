import styles from "./Dashboard.module.css";
import {
    fetchBlogs,
    createBlog,
    updateBlog,
    uploadBlogImage,
    deleteBlog,
} from "../../redux/features/blog/blogSlice";

import {
    useAppDispatch,
    useAppSelector
} from "../../redux/hooks/reduxHooks";
import { useState } from "react";



interface Blog {
    id: number;
    title: string;
    content: string;
    image?: string;
    username?: string;
}

interface BlogListProps {
    blogs: Blog[];
}

const BlogList = ({ blogs }: BlogListProps) => {

    const dispatch = useAppDispatch();

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editImage, setEditImage] = useState<File | null>(null);



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

    }
    return (
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
    )
}

export default BlogList