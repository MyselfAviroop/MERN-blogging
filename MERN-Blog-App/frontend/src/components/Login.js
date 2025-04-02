import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { login } from "../services/api.js";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";

const LoginContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: ${({ theme }) => theme.colors.gradient.background};
`;

const LoginCard = styled(motion.div)`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 3rem;
    width: 100%;
    max-width: 450px;
    box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const LoginHeader = styled.div`
    text-align: center;
    margin-bottom: 2rem;
`;

const Title = styled.h1`
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 1rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const FormGroup = styled.div`
    position: relative;
`;

const Input = styled.input`
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 2px solid ${({ theme, error }) => error ? theme.colors.error : theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
    }
`;

const IconWrapper = styled.div`
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme, error }) => error ? theme.colors.error : theme.colors.textLight};
`;

const PasswordToggle = styled.button`
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textLight};
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const ErrorMessage = styled(motion.div)`
    color: ${({ theme }) => theme.colors.error};
    font-size: 0.875rem;
    margin-top: 0.5rem;
`;

const SubmitButton = styled(motion.button)`
    background: ${({ theme }) => theme.colors.gradient.primary};
    color: white;
    padding: 1rem;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: 1rem;
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

const SignupLink = styled.div`
    text-align: center;
    margin-top: 1.5rem;
    color: ${({ theme }) => theme.colors.textLight};

    a {
        color: ${({ theme }) => theme.colors.primary};
        text-decoration: none;
        font-weight: 600;

        &:hover {
            text-decoration: underline;
        }
    }
`;

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return false;
        }
        if (!formData.email.includes("@")) {
            setError("Please enter a valid email address");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        setError("");

        try {
            const response = await login(formData);
            if (response.data.token) {
                sessionStorage.setItem("isLoggedIn", "true");
                sessionStorage.setItem("username", response.data.name);
                sessionStorage.setItem("token", response.data.token);
                navigate("/posts");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginContainer>
            <LoginCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <LoginHeader>
                    <Title>Welcome Back</Title>
                    <Subtitle>Sign in to continue to your account</Subtitle>
                </LoginHeader>

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <IconWrapper>
                            <FaEnvelope />
                        </IconWrapper>
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            error={error}
                        />
                    </FormGroup>

                    <FormGroup>
                        <IconWrapper>
                            <FaLock />
                        </IconWrapper>
                        <Input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            error={error}
                        />
                        <PasswordToggle
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </PasswordToggle>
                    </FormGroup>

                    {error && (
                        <ErrorMessage
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {error}
                        </ErrorMessage>
                    )}

                    <SubmitButton
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </SubmitButton>
                </Form>

                <SignupLink>
                    Don't have an account?{" "}
                    <Link to="/signup">Sign up</Link>
                </SignupLink>
            </LoginCard>
        </LoginContainer>
    );
};

export default Login;
