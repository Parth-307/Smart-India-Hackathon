import { Link } from "react-router-dom";
import './style.css'

export default function Login() {
    return (
        <div className="container-login">
            <div className="form-wrapper login-wrapper">
                <div className="form-header">
                    <h1>Admin Login</h1>
                    <p>Welcome back! Please sign in to your account</p>
                </div>

                <form id="loginForm" className="auth-form">
                    {/* <!-- Work Email Field --> */}
                    <div className="input-group">
                        <label for="loginEmail">Work Email</label>
                        <div className="input-container">
                            <input type="email" id="loginEmail" name="loginEmail" required />
                                <span className="validation-icon"></span>
                        </div>
                        <span className="error-message" id="loginEmailError"></span>
                    </div>

                    {/* <!-- Password Field --> */}
                    <div className="input-group">
                        <label for="loginPassword">Password</label>
                        <div className="input-container">
                            <input type="password" id="loginPassword" name="loginPassword" required />
                                <button type="button" className="password-toggle" id="loginPasswordToggle">
                                    <span className="eye-icon">👁️</span>
                                </button>
                                <span className="validation-icon"></span>
                        </div>
                        <span className="error-message" id="loginPasswordError"></span>
                    </div>

                    {/* <!-- Remember Me & Forgot Password --> */}
                    <div className="form-options">
                        <label className="checkbox-container">
                            <input type="checkbox" id="rememberMe" />
                                <span className="checkmark"></span>
                                Remember me
                        </label>
                        <a href="#" className="forgot-password">Forgot Password?</a>
                    </div>

                    {/* <!-- Login Button --> */}
                    <button type="submit" id="loginBtn" className="primary-btn" disabled>
                        <span className="btn-text">Login</span>
                        <span className="loading-spinner" id="loginSpinner"></span>
                    </button>

                    {/* <!-- Error Message Display --> */}
                    <div className="login-error" id="loginError"></div>
                </form>

                <div className="form-footer">
                    <p>Don't have an account? <Link to="signup">Sign up here</Link></p>
                </div>

                {/* <!-- Success Message --> */}
                <div className="success-message" id="loginSuccessMessage">
                    <div className="success-content">
                        <div className="success-icon">✓</div>
                        <h3>Login Successful!</h3>
                        <p>Redirecting to dashboard...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}