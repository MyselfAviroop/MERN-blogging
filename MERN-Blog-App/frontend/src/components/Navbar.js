import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Nav = styled(motion.nav).attrs(({ scrolled }) => ({
    scrolled: scrolled ? 1 : 0, // Ensures boolean is not passed as an attribute
}))`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: ${({ scrolled, theme }) => 
        scrolled ? theme.colors.surface : 'transparent'};
    padding: 1rem 0;
    transition: all 0.3s ease;
    box-shadow: ${({ scrolled, theme }) => 
        scrolled ? theme.shadows.md : 'none'};
`;

const NavContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Logo = styled(Link)`
    font-size: 1.5rem;
    font-weight: 700;
    color: black; 
    text-decoration: none;
    background: none; 
    -webkit-background-clip: unset;
    -webkit-text-fill-color: unset;
`;


const NavLinks = styled.div`
    display: flex;
    gap: 2rem;
    align-items: center;

    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
        display: none;
    }
`;

const NavLink = styled(Link)`
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    position: relative;

    &:after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 0;
        height: 2px;
        background: ${({ theme }) => theme.colors.gradient.primary};
        transition: width 0.3s ease;
    }

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }

    &:hover:after {
        width: 100%;
    }
`;

const Button = styled(motion.button).attrs(() => ({
    whilehover: { scale: 1.05 },
    whiletap: { scale: 0.95 }
}))`
    padding: 0.5rem 1.5rem;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &.primary {
        background: ${({ theme }) => theme.colors.gradient.primary};
        color: white;
        border: none;

        &:hover {
            transform: translateY(-2px);
            box-shadow: ${({ theme }) => theme.shadows.md};
        }
    }

    &.outline {
        background: transparent;
        border: 2px solid ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.primary};

        &:hover {
            background: ${({ theme }) => theme.colors.primary};
            color: white;
        }
    }
`;

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsLoggedIn(sessionStorage.getItem("isLoggedIn") === "true");
    }, [location]);

    const handleLogout = () => {
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <Nav
            ref={ref}
            scrolled={scrolled}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <NavContainer>
                <Logo to="/">BlogApp</Logo>
                
                <NavLinks>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/posts">Posts</NavLink>
                    {isLoggedIn ? (
                        <>
                            <NavLink to="/create-post">Create Post</NavLink>
                            <NavLink to="/profile">Profile</NavLink>
                            <Button className="outline" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button className="outline" as={Link} to="/login">
                                Login
                            </Button>
                            <Button className="primary" as={Link} to="/signup">
                                Sign Up
                            </Button>
                        </>
                    )}
                </NavLinks>
            </NavContainer>
        </Nav>
    );
};

export default Navbar;