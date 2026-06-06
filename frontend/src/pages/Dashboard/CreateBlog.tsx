import { useState } from "react";
import styles from "./Dashboard.module.css";
import {
    useAppDispatch,
    useAppSelector
} from "../../redux/hooks/reduxHooks";

import {
    fetchBlogs,
    createBlog,
    uploadBlogImage,
    deleteBlog,
} from "../../redux/features/blog/blogSlice";


function CreateBlog() {

    const dispatch = useAppDispatch()
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);

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

    return (
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
                    <button className={styles.createButton}
                        onClick={handleCreate}
                    >
                        Publish Blog
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateBlog