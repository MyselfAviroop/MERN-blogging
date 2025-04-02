import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { getProfile } from "../services/api.js";

const ProfileContainer = styled.div`
    max-width: 800px;
    margin: 6rem auto 2rem;
    padding: 0 2rem;
`;

const ProfileHeader = styled(motion.div)`
    text-align: center;
    margin-bottom: 3rem;
`;

const ProfileTitle = styled.h1`
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
`;

const ProfileCard = styled(motion.div)`
    background: white;
    padding: 2rem;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    box-shadow: ${({ theme }) => theme.shadows.md};
`;

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: ${({ theme }) => theme.colors.surface};
    border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const Label = styled.span`
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
`;

const Value = styled.span`
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

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                setProfile(response.data);
                setError("");
            } catch (err) {
                setError("Failed to load profile. Please try again later.");
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <LoadingSpinner>
                <div className="spinner" />
            </LoadingSpinner>
        );
    }

    if (error) {
        return (
            <ProfileContainer>
                <ErrorMessage>{error}</ErrorMessage>
            </ProfileContainer>
        );
    }

    return (
        <ProfileContainer>
            <ProfileHeader
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <ProfileTitle>My Profile</ProfileTitle>
            </ProfileHeader>
            <ProfileCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <ProfileInfo>
                    <InfoItem>
                        <Label>Name:</Label>
                        <Value>{profile.name}</Value>
                    </InfoItem>
                    <InfoItem>
                        <Label>Email:</Label>
                        <Value>{profile.email}</Value>
                    </InfoItem>
                    <InfoItem>
                        <Label>Member Since:</Label>
                        <Value>{new Date(profile.createdAt).toLocaleDateString()}</Value>
                    </InfoItem>
                </ProfileInfo>
            </ProfileCard>
        </ProfileContainer>
    );
};

export default Profile; 