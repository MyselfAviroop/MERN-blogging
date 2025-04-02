import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = styled.section`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    background: ${({ theme }) => theme.colors.gradient.primary};
    position: relative;
    overflow: hidden;
`;

const HeroContent = styled.div`
    max-width: 800px;
    color: white;
    position: relative;
    z-index: 1;
`;

const Title = styled.h1`
    font-size: 4rem;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    background: linear-gradient(to right, #ffffff, #f0f0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
    font-size: 1.5rem;
    margin-bottom: 2rem;
    opacity: 0.9;
`;

const CTAButton = styled.button`
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background: white;
    color: ${({ theme }) => theme.colors.primary};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.lg};
    }
`;

const FeaturesSection = styled.section`
    padding: 6rem 2rem;
    background: ${({ theme }) => theme.colors.background};
`;

const FeaturesGrid = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
`;

const FeatureCard = styled.div`
    background: white;
    padding: 2rem;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    box-shadow: ${({ theme }) => theme.shadows.md};
    text-align: center;
    transform-style: preserve-3d;
    transform: perspective(1000px);
`;

const FeatureIcon = styled.div`
    font-size: 2.5rem;
    margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
    color: ${({ theme }) => theme.colors.textLight};
    line-height: 1.6;
`;

const Landing = () => {
    const featureRefs = useRef([]);
    featureRefs.current = [];

    useEffect(() => {
        featureRefs.current.forEach((el, index) => {
            gsap.fromTo(
                el,
                { opacity: 0, y: 50, rotateY: -15 },
                {
                    opacity: 1,
                    y: 0,
                    rotateY: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                }
            );
        });
    }, []);

    return (
        <>
            <HeroSection>
                <HeroContent>
                    <Title>Welcome to BlogApp</Title>
                    <Subtitle>Share your thoughts, connect with others, and explore amazing stories</Subtitle>
                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                        <CTAButton>Get Started</CTAButton>
                    </Link>
                </HeroContent>
            </HeroSection>

            <FeaturesSection>
                <FeaturesGrid>
                    {["✍️", "🤝", "📚"].map((icon, index) => (
                        <FeatureCard key={index} ref={(el) => featureRefs.current.push(el)}>
                            <FeatureIcon>{icon}</FeatureIcon>
                            <FeatureTitle>{["Write & Share", "Connect", "Discover"][index]}</FeatureTitle>
                            <FeatureDescription>
                                {["Create beautiful blog posts and share them with the world", "Engage with other writers and build your community", "Explore diverse topics and learn from others"][index]}
                            </FeatureDescription>
                        </FeatureCard>
                    ))}
                </FeaturesGrid>
            </FeaturesSection>
        </>
    );
};

export default Landing;
