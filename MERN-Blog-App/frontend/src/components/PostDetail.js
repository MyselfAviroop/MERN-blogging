import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { getPost } from "../services/api.js";

const PostContainer = styled.div`
    max-width: 800px;
    margin: 6rem auto 2rem;
    padding: 0 2rem;
`;

const PostHeader = styled(motion.div)`
    text-align: center;
    margin-bottom: 3rem;
`;

const PostTitle = styled.h1`
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
`;

const PostMeta = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 0.9rem;
`;

const PostContent = styled(motion.div)`
    background: white;
    padding: 2rem;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    box-shadow: ${({ theme }) => theme.shadows.md};
    line-height: 1.8;
    color: ${({ theme }) => theme.colors.text};
`;

const LoadingSpinner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
`;

const ErrorMessage = styled.div`
    text-align: center;
    color: ${({ theme }) => theme.colors.error};
    padding: 2rem;
    background: rgba(214, 48, 49, 0.1);
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin: 2rem 0;
`;

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await getPost(id);
                if (!response.data) {
                    throw new Error("Post not found");
                }
                setPost(response.data);
                setError("");
            } catch (err) {
                setError(err.message || "Failed to load post. Please try again later.");
                console.error("Error fetching post:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <LoadingSpinner>
                <div className="spinner" />
            </LoadingSpinner>
        );
    }

    if (error) {
        return (
            <PostContainer>
                <ErrorMessage>{error}</ErrorMessage>
            </PostContainer>
        );
    }

    if (!post) {
        return (
            <PostContainer>
                <ErrorMessage>Post not found</ErrorMessage>
            </PostContainer>
        );
    }

    return (
        <PostContainer>
            <PostHeader
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <PostTitle>{post.title}</PostTitle>
                <PostMeta>
                    <span>👤 {post.author}</span>
                    <span>📅 {new Date(post.date).toLocaleDateString()}</span>
                </PostMeta>
            </PostHeader>
            <PostContent
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {post.body}
            </PostContent>
        </PostContainer>
    );
};

export default PostDetail; 