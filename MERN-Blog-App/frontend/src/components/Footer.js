import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    padding: 4rem 2rem 2rem;
    margin-top: auto;
`;

const FooterContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
`;

const FooterSection = styled.div`
    h3 {
        font-size: 1.2rem;
        margin-bottom: 1rem;
        color: white;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li {
        margin-bottom: 0.5rem;
    }

    a {
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
            color: white;
        }
    }
`;

const FooterBottom = styled.div`
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
`;

const SocialLinks = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;

    a {
        color: white;
        font-size: 1.5rem;
        transition: transform 0.3s ease;

        &:hover {
            transform: translateY(-3px);
        }
    }
`;

const Footer = () => {
    return (
        <FooterContainer>
            <FooterContent>
                <FooterSection>
                    <h3>About Us</h3>
                    <p>BlogApp is a platform for sharing knowledge, experiences, and stories with the world.</p>
                    <SocialLinks>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">𝕏</a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">in</a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer">⌨</a>
                    </SocialLinks>
                </FooterSection>

                <FooterSection>
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/posts">Blog Posts</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </FooterSection>

                <FooterSection>
                    <h3>Categories</h3>
                    <ul>
                        <li><Link to="/category/technology">Technology</Link></li>
                        <li><Link to="/category/lifestyle">Lifestyle</Link></li>
                        <li><Link to="/category/travel">Travel</Link></li>
                        <li><Link to="/category/food">Food</Link></li>
                    </ul>
                </FooterSection>

                <FooterSection>
                    <h3>Contact Us</h3>
                    <ul>
                        <li>Email: contact@blogapp.com</li>
                        <li>Phone: (555) 123-4567</li>
                        <li>Address: 123 Blog Street, Digital City</li>
                    </ul>
                </FooterSection>
            </FooterContent>

            <FooterBottom>
                <p>&copy; {new Date().getFullYear()} BlogApp. All rights reserved.</p>
            </FooterBottom>
        </FooterContainer>
    );
};

export default Footer;
