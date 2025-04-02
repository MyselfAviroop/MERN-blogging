import React, { Component } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { motion } from "framer-motion";
import sanitizeHtml from "sanitize-html";
import "../styles/Editor.css";

const baseURL = process.env.REACT_APP_BASEURL || "http://localhost:5100";

class EditPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            body: "",
            author: "",
            date: "",
            isLoggedIn: false,
            isSubmitting: false,
            error: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);
    }

    componentDidMount() {
        const token = sessionStorage.getItem("token");
        axios
            .get(`${baseURL}/server/posts/${this.props.match.params.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((post) => {
                this.setState({
                    title: post.data.title,
                    body: post.data.body,
                    author: post.data.author,
                    date: post.data.date,
                    comments: post.data.comments,
                });
            })
            .catch((err) => {
                console.error(err);
                if (err.response && err.response.status === 401) {
                    this.setState({ error: "Your session has expired. Please login again." });
                    setTimeout(() => window.location = "/login", 2000);
                }
            });

        if (sessionStorage.getItem("isLoggedIn") === "true") {
            this.setState({ isLoggedIn: true });
        }
    }

    handleEditorChange(event, editor) {
        this.setState({ body: editor.getData() });
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
            error: ""
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ isSubmitting: true, error: "" });

        const sanitizedData = sanitizeHtml(this.state.body);
        const editedPost = {
            title: this.state.title,
            author: this.state.author,
            body: sanitizedData,
            date: this.state.date,
            comments: this.state.comments,
        };

        const token = sessionStorage.getItem("token");
        axios
            .post(
                `${baseURL}/server/posts/edit/${this.props.match.params.id}`,
                editedPost,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            .then(() => {
                window.location = `/posts/${this.props.match.params.id}`;
            })
            .catch((err) => {
                console.error(err);
                if (err.response && err.response.status === 401) {
                    this.setState({ 
                        error: "Your session has expired. Please login again.",
                        isSubmitting: false 
                    });
                    setTimeout(() => window.location = "/login", 2000);
                } else {
                    this.setState({ 
                        error: "Failed to update post. Please try again.",
                        isSubmitting: false 
                    });
                }
            });
    }

    render() {
        if (!this.state.isLoggedIn) {
            return (
                <motion.div 
                    className="container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        You need to login to edit posts!
                        <button
                            type="button"
                            className="btn-close float-end"
                            onClick={() => window.location = "/login"}
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
                <div className="edit-post">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <motion.h1 
                                className="post-title mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                Edit Blog Post
                                <span className="full-stop">.</span>
                            </motion.h1>

                            {this.state.error && (
                                <motion.div 
                                    className="alert alert-danger"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {this.state.error}
                                </motion.div>
                            )}

                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group mb-4">
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control form-control-lg"
                                        placeholder="Enter your post title"
                                        value={this.state.title}
                                        onChange={this.handleChange}
                                        required
                                        disabled={this.state.isSubmitting}
                                    />
                                </div>

                                <div className="form-group mb-4">
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={this.state.body}
                                        onChange={this.handleEditorChange}
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
                                    disabled={this.state.isSubmitting}
                                    whilehover={{ scale: 1.02 }}
                                    whiletap={{ scale: 0.98 }}
                                >
                                    {this.state.isSubmitting ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Updating post...
                                        </motion.div>
                                    ) : (
                                        "Update Post"
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }
}

export default EditPost;
