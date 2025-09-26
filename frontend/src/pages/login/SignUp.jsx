import { Link } from "react-router-dom";
import './style.css'

export default function SignUp(){
    return(
        <div className="container-signup">
        <div className="form-wrapper">
            <div className="form-header">
                <h1>Admin Signup</h1>
                <p>Create your admin account for the college chatbot system</p>
            </div>

            <form id="signupForm" className="auth-form">
                {/* <!-- Full Name Field --> */}
                <div className="input-group">
                    <label for="fullName">Full Name</label>
                    <div className="input-container">
                        <input type="text" id="fullName" name="fullName" required />
                        <span className="validation-icon"></span>
                    </div>
                    <span className="error-message" id="fullNameError"></span>
                </div>

                {/* <!-- Work Email Field --> */}
                <div className="input-group">
                    <label for="workEmail">Work Email</label>
                    <div className="input-container">
                        <input type="email" id="workEmail" name="workEmail" required />
                        <span className="validation-icon"></span>
                    </div>
                    <span className="error-message" id="workEmailError"></span>
                </div>

                {/* <!-- Password Field --> */}
                <div className="input-group">
                    <label for="password">Create Password</label>
                    <div className="input-container">
                        <input type="password" id="password" name="password" required />
                        <button type="button" className="password-toggle" id="passwordToggle">
                            <span className="eye-icon">👁️</span>
                        </button>
                        <span className="validation-icon"></span>
                    </div>
                    <span className="error-message" id="passwordError"></span>
                    <div className="password-strength">
                        <div className="strength-bar">
                            <div className="strength-fill" id="strengthFill"></div>
                        </div>
                        <span className="strength-text" id="strengthText">Password strength</span>
                    </div>
                </div>

                {/* <!-- College Website URL Field --> */}
                <div className="input-group">
                    <label for="collegeUrl">College Website URL</label>
                    <div className="input-container">
                        <input type="url" id="collegeUrl" name="collegeUrl" placeholder="https://example.edu" required />
                        <span className="validation-icon"></span>
                    </div>
                    <span className="error-message" id="collegeUrlError"></span>
                </div>

                {/* <!-- Phone Number Field --> */}
                <div className="input-group">
                    <label for="phoneNumber">Phone Number</label>
                    <div className="input-container">
                        <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="1234567890" maxlength="10" required />
                        <span className="validation-icon"></span>
                    </div>
                    <span className="error-message" id="phoneNumberError"></span>
                </div>

                {/* <!-- Get OTP Button --> */}
                <button type="button" id="getOtpBtn" className="primary-btn" disabled>
                    <span className="btn-text">Get OTP</span>
                    <span className="loading-spinner" id="otpSpinner"></span>
                </button>

                {/* <!-- OTP Section (Initially Hidden) --> */}
                <div className="otp-section" id="otpSection">
                    <div className="input-group">
                        <label for="otpInput">Enter OTP</label>
                        <div className="input-container">
                            <input type="text" id="otpInput" name="otpInput" maxlength="6" placeholder="123456" />
                            <span className="validation-icon"></span>
                        </div>
                        <span className="error-message" id="otpError"></span>
                    </div>

                    <button type="submit" id="verifySignupBtn" className="primary-btn">
                        <span className="btn-text">Verify & Sign Up</span>
                        <span className="loading-spinner" id="verifySpinner"></span>
                    </button>
                </div>
            </form>

            <div className="form-footer">
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>

            {/* <!-- OTP Display Modal --> */}
            <div className="otp-modal" id="otpModal">
                <div className="modal-content">
                    <h3>OTP Generated</h3>
                    <p>A verification code has been sent. For this demo, your code is:</p>
                    <div className="otp-display" id="otpDisplay"></div>
                    <button type="button" className="modal-close" id="closeModal">Got it!</button>
                </div>
            </div>

            {/* <!-- Success Message --> */}
            <div className="success-message" id="successMessage">
                <div className="success-content">
                    <div className="success-icon">✓</div>
                    <h3>Account Created Successfully!</h3>
                    <p>Redirecting to login page...</p>
                </div>
            </div>
        </div>
    </div>
    )
}