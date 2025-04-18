import React, { Component, lazy, Suspense } from "react";
import axios from "axios";
import PropTypes from "prop-types";
const Comment = lazy(() => import("./Comment.js"));
const Filter = require("bad-words"); // A NSFW filter for censoring the comments

const baseURL = process.env.REACT_APP_BASEURL || "http://localhost:5100";
const renderLoader = () => (
    <div className="spinner-container">
        <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>
);

class CommentList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            body: "",
            imgs: [],
            comments: [],
            noOfComments: 5,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    //The post prop can take a while to arrive therefore cannot use componentDidMount
    componentDidUpdate(prevProps) {
        if (this.props.post !== prevProps.post)
            this.setState({ comments: this.props.post.comments });
    }

    handleChange(event) {
        // Store comment body in  the state
        const { value } = event.target;
        this.setState({
            body: value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const token = sessionStorage.getItem("token");
        axios
            .post(
                `${baseURL}/server/posts/edit/${this.props.post._id}`,
                {
                    title: this.props.post.title,
                    body: this.props.post.body,
                    author: this.props.post.author,
                    date: this.props.post.date,
                    comments: [
                        ...this.state.comments,
                        this.state.body
                    ]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            .then((res) => {
                this.setState({
                    comments: [...this.state.comments, this.state.body],
                    body: ""
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

    render() {
        return (
            <div className="comment-list">
                <hr />
                <h5 className="comment-heading">
                    Latest Comments<span className="full-stop">.</span>
                </h5>
                <br />
                <div>
                    {/* Render comments in reverse chronological order */}
                    {this.state.comments.length ? (
                        <div>
                            {this.state.comments
                                .slice(0, this.state.noOfComments)
                                .map((currentcomment, index) => (
                                    <Suspense
                                        key={index}
                                        fallback={renderLoader()}
                                    >
                                        <Comment
                                            comment={currentcomment}
                                            img={`${index * 9}`} // img prop is used in generating jdenticon and requires a random string to generate the avatar
                                        />
                                    </Suspense>
                                ))}
                        </div>
                    ) : (
                        <h4 id="first-comment">
                            Be the first person to comment on this post
                            <span className="full-stop">.</span>
                        </h4>
                    )}

                    {/* The 'Load more comments' button's implementation */}
                    {/* This sets state, which in turn re-renders the list of comments */}
                    {this.state.comments[this.state.noOfComments] ? (
                        <button
                            className="btn btn-link"
                            onClick={() =>
                                this.setState((prevState) => ({
                                    noOfComments: prevState.noOfComments + 5,
                                }))
                            }
                        >
                            Load More Comments...
                        </button>
                    ) : (
                        " "
                    )}
                </div>

                <div className="comment-form">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                onChange={this.handleChange}
                                placeholder="Start typing your comment..."
                                value={this.state.body}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="submit"
                                className="btn btn-outline-success"
                                value="comment"
                            />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

// PropTypes
CommentList.propTypes = {
    post: PropTypes.object.isRequired,
};

export default CommentList;
