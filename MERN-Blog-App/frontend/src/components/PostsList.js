import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getPosts } from "../services/api.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger);

const PostsContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 6rem 2rem 2rem;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 3rem;
`;

const Title = styled(motion.h1)`
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
    background: ${({ theme }) => theme.colors.gradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const Subtitle = styled(motion.p)`
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
`;

const PostsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
`;

const PostCard = styled(motion.div)`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    overflow: hidden;
    box-shadow: ${({ theme }) => theme.shadows.md};
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: ${({ theme }) => theme.shadows.lg};
    }
`;

const PostImage = styled.div`
    height: 200px;
    background: ${({ theme }) => theme.colors.gradient.secondary};
    position: relative;
    overflow: hidden;
`;

const PostContent = styled.div`
    padding: 1.5rem;
`;

const PostTitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.primary};
`;

const PostExcerpt = styled.p`
    color: ${({ theme }) => theme.colors.textLight};
    margin-bottom: 1rem;
    line-height: 1.6;
`;

const PostMeta = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 0.9rem;
`;

const LoadMoreButton = styled(motion.button).attrs(() => ({
    // whilehover: { scale: 1.05 }
}))`
    display: block;
    margin: 2rem auto;
    padding: 1rem 2rem;
    background: ${({ theme }) => theme.colors.gradient.primary};
    color: white;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.md};
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.div`
    text-align: center;
    color: ${({ theme }) => theme.colors.error};
    padding: 2rem;
    background: rgba(214, 48, 49, 0.1);
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin: 2rem 0;
`;

const PostsList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await getPosts(page);
                
                // Filter out duplicate posts
                const newPosts = response.data.filter(newPost => 
                    !posts.some(existingPost => existingPost._id === newPost._id)
                );
                
                setPosts(prev => [...prev, ...newPosts]);
                setHasMore(response.data.length === 10);
                setError("");
            } catch (err) {
                setError("Failed to fetch posts. Please try again later.");
                console.error("Error fetching posts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

        return (
        <PostsContainer>
            <Header>
                <Title initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>Latest Blog Posts</Title>
                <Subtitle initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>Discover amazing stories and insights from our community of writers</Subtitle>
            </Header>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <PostsGrid>
                <AnimatePresence>
                    {posts.map((post, index) => (
                        <PostCard key={post._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} exit={{ opacity: 0, y: -20 }}>
                            <Link to={`/post/${post._id}`} style={{ textDecoration: 'none' }}>
                                <PostImage />
                                <PostContent>
                                    <PostTitle>{post.title || "Untitled Post"}</PostTitle>
                                    <PostExcerpt>{post.content ? post.content.substring(0, 150) + "..." : "No content available"}</PostExcerpt>
                                    <PostMeta>
                                        <span>👤 {post.author || "Unknown Author"}</span>
                                        <span>📅 {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Unknown Date"}</span>
                                    </PostMeta>
                                </PostContent>
                            </Link>
                        </PostCard>
                    ))}
                </AnimatePresence>
            </PostsGrid>

            {hasMore && !loading && <LoadMoreButton onClick={handleLoadMore}>Load More Posts</LoadMoreButton>}
        </PostsContainer>
    );
};

export default PostsList;