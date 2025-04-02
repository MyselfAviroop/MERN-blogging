import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { register } from "../services/api.js";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from "react-icons/fa";

const SignupContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: ${({ theme }) => theme.colors.gradient.background};
`;

const SignupCard = styled(motion.div)`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 3rem;
    width: 100%;
    max-width: 500px;
    box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const SignupHeader = styled.div`
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

const PasswordStrength = styled.div`
    margin-top: 0.5rem;
    display: flex;
    gap: 0.5rem;
`;

const StrengthBar = styled.div`
    height: 4px;
    flex: 1;
    background: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.border};
    border-radius: 2px;
    transition: all 0.3s ease;
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

const LoginLink = styled.div`
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

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateName = (name) => {
        return name.length >= 2 && name.length <= 50;
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (password.match(/[a-z]/)) strength += 1;
        if (password.match(/[A-Z]/)) strength += 1;
        if (password.match(/[0-9]/)) strength += 1;
        if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }

        if (name === "password") {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!validateName(formData.name)) {
            newErrors.name = "Name must be between 2 and 50 characters";
        }

        if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        } else if (passwordStrength < 3) {
            newErrors.password = "Password is too weak. Include uppercase, lowercase, numbers, and special characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            
            if (response.data.token) {
                sessionStorage.setItem("isLoggedIn", "true");
                sessionStorage.setItem("username", response.data.name);
                sessionStorage.setItem("token", response.data.token);
                navigate("/posts");
            }
        } catch (err) {
            setErrors({
                submit: err.response?.data?.message || "Registration failed. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SignupContainer>
            <SignupCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <SignupHeader>
                    <Title>Create Account</Title>
                    <Subtitle>Join our community of writers and readers</Subtitle>
                </SignupHeader>

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <IconWrapper>
                            <FaUser />
                        </IconWrapper>
                        <Input
                            type="text"
                            name="name"
                            placeholder="Full name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                        />
                        {errors.name && (
                            <ErrorMessage
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {errors.name}
                            </ErrorMessage>
                        )}
                    </FormGroup>

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
                            error={errors.email}
                        />
                        {errors.email && (
                            <ErrorMessage
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {errors.email}
                            </ErrorMessage>
                        )}
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
                            error={errors.password}
                        />
                        <PasswordToggle
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </PasswordToggle>
                        {errors.password && (
                            <ErrorMessage
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {errors.password}
                            </ErrorMessage>
                        )}
                        <PasswordStrength>
                            {[1, 2, 3, 4, 5].map((level) => (
                                <StrengthBar
                                    key={level}
                                    active={level <= passwordStrength}
                                />
                            ))}
                        </PasswordStrength>
                    </FormGroup>

                    <FormGroup>
                        <IconWrapper>
                            <FaLock />
                        </IconWrapper>
                        <Input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                        />
                        {errors.confirmPassword && (
                            <ErrorMessage
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {errors.confirmPassword}
                            </ErrorMessage>
                        )}
                    </FormGroup>

                    {errors.submit && (
                        <ErrorMessage
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {errors.submit}
                        </ErrorMessage>
                    )}

                    <SubmitButton
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </SubmitButton>
                </Form>

                <LoginLink>
                    Already have an account?{" "}
                    <Link to="/login">Sign in</Link>
                </LoginLink>
            </SignupCard>
        </SignupContainer>
    );
};

export default Signup; 