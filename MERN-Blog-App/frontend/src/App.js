import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme.js";
import { GlobalStyles } from "./styles/GlobalStyles.js";
import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import Landing from "./components/Landing.js";
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import PostsList from "./components/PostsList.js";
import CreatePosts from "./components/CreatePosts.js";
import PostDetail from "./components/PostDetail.js";
import Profile from "./components/Profile.js";
import PrivateRoute from "./components/PrivateRoute.js";
import styled from "styled-components";

const AppContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

const MainContent = styled.main`
    flex: 1;
`;

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AppContainer>
                    <Navbar />
                    <MainContent>
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/posts" element={<PostsList />} />
                            <Route path="/post/:id" element={<PostDetail />} />
                            
                            {/* Protected Routes */}
                            <Route 
                                path="/create-post" 
                                element={
                                    <PrivateRoute>
                                        <CreatePosts />
                                    </PrivateRoute>
                                } 
                            />
                            <Route 
                                path="/profile" 
                                element={
                                    <PrivateRoute>
                                        <Profile />
                                    </PrivateRoute>
                                } 
                            />
                        </Routes>
                    </MainContent>
                    <Footer />
                </AppContainer>
            </Router>
        </ThemeProvider>
    );
};

export default App;
