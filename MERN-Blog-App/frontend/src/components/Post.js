import React, { Component, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import alert css
import axios from "axios";
import PropTypes from "prop-types";
const CommentList = lazy(() => import("./CommentList.js"));

// The same post component is used in the Postslist component and to SHOW the individual post component
const baseURL = process.env.REACT_APP_BASEURL || "http://localhost:5100";
const RenderLoader = () => (
    <div className="spinner-container">
        <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>
);

class Post extends Component {
    constructor(props) {
        // When all the Posts has to to be showed, the "post" prop is recieved from the Postslist compnent
        super(props);
        this.state = { 
            post: {}, 
            isLoggedIn: false, 
            readingTime: 0,
            isLoaded: false
        };

        this.deletePost = this.deletePost.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
    }

    componentDidMount() {
        // If this component is rendered to SHOW individual Post component, make an API call to get that individual post
        if (!this.props.post) {
            const token = sessionStorage.getItem("token");
            axios
                .get(`${baseURL}/server/posts/${this.props.match.params.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then((response) => {
                    const post = response.data;
                    const wordsPerMinute = 200;
                    const noOfWords = post.body.split(" ").length;
                    const readingTime = noOfWords ? Math.floor(noOfWords / wordsPerMinute) : 0;
                    
                    this.setState({ 
                        post,
                        readingTime,
                        isLoaded: true
                    });
                })
                .catch((err) => {
                    console.error(err);
                    if (err.response && err.response.status === 401) {
                        alert("Your session has expired. Please login again.");
                        window.location = "/login";
                    }
                });
        }
    }

    // Check if the correct user is logged in to display the edit and delete buttons
    componentDidUpdate() {
        if (
            sessionStorage.getItem("isLoggedIn") === "true" &&
            this.state.post.author === sessionStorage.getItem("username")
        ) {
            this.setState({ isLoggedIn: true });
        }
    }

    // React-conform-alert to delete a post
    confirmDelete(id) {
        confirmAlert({
            title: "Confirm to delete this post",
            message: "Are you sure you want to delete this post? This action cannot be undone.",
            buttons: [
                {
                    label: "Yes, delete it",
                    onClick: () => this.deletePost(id),
                    className: "btn btn-outline-danger"
                },
                {
                    label: "No, keep it",
                    onClick: () => console.log("Post deletion cancelled"),
                    className: "btn btn-outline-primary"
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true
        });
    }

    deletePost(id) {
        const token = sessionStorage.getItem("token");
        axios
            .delete(`${baseURL}/server/posts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(() => {
                window.location = "/posts";
            })
            .catch((err) => {
                console.error(err);
                if (err.response && err.response.status === 401) {
                    alert("Your session has expired. Please login again.");
                    window.location = "/login";
                }
            });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    render() {
        // When the posts are being rendered as a part of the PostsList component
        if (this.props.post) {
            const { post } = this.props;
            return (
                <div className="card fade-in">
                    <div className="card-body">
                        <Link to={"/posts/" + post._id} className="post-link">
                            <h1 className="post-title">{post.title}</h1>
                            <div className="post-meta">
                                <span className="author">By {post.author}</span>
                                <time>{this.formatDate(post.date)}</time>
                            </div>
                            <div
                                className="post-preview"
                                dangerouslySetInnerHTML={{
                                    __html: post.body.substring(0, 400).trim() + "...",
                                }}
                            />
                        </Link>
                    </div>
                </div>
            );
        }
        // To render the SHOW page for all the individual posts
        else {
            const { post, isLoggedIn, readingTime, isLoaded } = this.state;
            
            if (!isLoaded) {
                return <RenderLoader />;
            }

            return (
                <div className="post fade-in">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="post-title">{post.title}</h1>
                            <div className="post-meta">
                                <span className="author">By {post.author}</span>
                                <time>{this.formatDate(post.date)}</time>
                                <span className="read-time">~ {readingTime} min read</span>
                            </div>
                            <div
                                className="post-body"
                                dangerouslySetInnerHTML={{
                                    __html: post.body,
                                }}
                            />
                            {isLoggedIn && (
                                <div className="post-actions">
                                    <Link
                                        to={`/posts/${post._id}/edit`}
                                        className="btn btn-outline-primary"
                                    >
                                        <i className="fas fa-edit"></i> Edit
                                    </Link>
                                    <button
                                        onClick={() => this.confirmDelete(post._id)}
                                        className="btn btn-outline-danger"
                                    >
                                        <i className="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <Suspense fallback={<RenderLoader />}>
                        <CommentList post={post} />
                    </Suspense>
                </div>
            );
        }
    }
}

Post.propTypes = {
    post: PropTypes.object,
};

export default Post;
