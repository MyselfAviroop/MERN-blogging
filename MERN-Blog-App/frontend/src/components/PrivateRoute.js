import React from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

const LoadingContainer = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
`;

const PrivateRoute = ({ children }) => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const token = sessionStorage.getItem("token");

    if (!isLoggedIn || !token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <LoadingContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </LoadingContainer>
    );
};

export default PrivateRoute; 