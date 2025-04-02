import React, { useState, useEffect } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import sanitizeHtml from "sanitize-html";
import "../styles/Editor.css";

const baseURL = process.env.REACT_APP_BASEURL || "http://localhost:5100";

const CreatePosts = () => {
    const [formData, setFormData] = useState({
        title: "",
        body: "",
        author: "",
        date: new Date()
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem("isLoggedIn") === "true") {
            setIsLoggedIn(true);
            setFormData(prev => ({
                ...prev,
                author: sessionStorage.getItem("username")
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError("");
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setFormData(prev => ({
            ...prev,
            body: data
        }));
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError("Please enter a title");
            return false;
        }
        if (!formData.body.trim()) {
            setError("Please enter some content");
            return false;
        }
        const sanitizedData = sanitizeHtml(formData.body.trim());
        if (sanitizedData.length < 400) {
            setError("Your post is too short! Please write at least 400 characters.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const token = sessionStorage.getItem("token");
            const sanitizedData = sanitizeHtml(formData.body.trim());
            
            await axios.post(`${baseURL}/server/posts/create/`, {
                ...formData,
                body: sanitizedData,
                date: new Date()
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            navigate("/posts");
        } catch (err) {
            console.error("Error creating post:", err);
            if (err.response?.status === 401) {
                setError("Your session has expired. Please login again.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError(err.response?.data?.message || "Failed to create post. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <motion.div 
                className="container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    You need to login to create a new post!
                    <button
                        type="button"
                        className="btn-close float-end"
                        onClick={() => navigate("/login")}
                        aria-label="Close"
                    ></button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            className="container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="create-post">
                <div className="card shadow-sm">
                    <div className="card-body p-4">
                        <motion.h1 
                            className="post-title mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Create New Blog Post
                            <span className="full-stop">.</span>
                        </motion.h1>

                        {error && (
                            <motion.div 
                                className="alert alert-danger"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-4">
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control form-control-lg"
                                    placeholder="Enter your post title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="form-group mb-4">
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={formData.body}
                                    onChange={handleEditorChange}
                                    config={{
                                        toolbar: {
                                            items: [
                                                'heading',
                                                '|',
                                                'bold',
                                                'italic',
                                                'link',
                                                'bulletedList',
                                                'numberedList',
                                                '|',
                                                'blockQuote',
                                                'insertTable',
                                                'undo',
                                                'redo'
                                            ]
                                        },
                                        language: 'en'
                                    }}
                                />
                            </div>

                            <motion.button 
                                type="submit" 
                                className="btn btn-primary btn-lg w-100"
                                disabled={isSubmitting}
                                whilehover={{ scale: 1.02 }}
                                whiletap={{ scale: 0.98 }}
                            >
                                {isSubmitting ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Creating post...
                                    </motion.div>
                                ) : (
                                    "Create Post"
                                )}
                            </motion.button>
                        </form>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CreatePosts;
