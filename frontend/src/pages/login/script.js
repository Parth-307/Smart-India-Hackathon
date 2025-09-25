/**
 * College Chatbot Admin Authentication System
 * Modern JavaScript implementation with enhanced security and UX
 * @version 2.0
 * @date September 2025
 */

'use strict';

// Global state management
const AppState = {
    currentOTP: '',
    signupData: {},
    validationRules: {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        url: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&=]*)$/,
        phone: /^[6-9]\d{9}$/,
        otp: /^\d{6}$/
    },
    debounceTimers: new Map()
};

// Utility functions
const Utils = {
    /**
     * Debounce function to limit function calls
     */
    debounce(func, delay, key) {
        return (...args) => {
            if (AppState.debounceTimers.has(key)) {
                clearTimeout(AppState.debounceTimers.get(key));
            }
            AppState.debounceTimers.set(key, setTimeout(() => func.apply(this, args), delay));
        };
    },

    /**
     * Sanitize input to prevent XSS
     */
    sanitizeInput(input) {
        const temp = document.createElement('div');
        temp.textContent = input;
        return temp.innerHTML;
    },

    /**
     * Generate cryptographically secure random OTP
     */
    generateSecureOTP() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return String(array[0]).slice(-6).padStart(6, '0');
    },

    /**
     * Hash password using Web Crypto API (simulation)
     */
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'college_chatbot_salt');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    /**
     * Show notification with better accessibility
     */
    showNotification(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Enhanced styling
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '12px',
            color: 'white',
            fontWeight: '500',
            fontSize: '14px',
            maxWidth: '320px',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)'
        });

        // Type-specific styling
        const colors = {
            error: '#EF4444',
            success: '#10B981',
            warning: '#F59E0B',
            info: '#3B82F6'
        };
        notification.style.background = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 400);
        }, duration);

        return notification;
    }
};

// Validation system
const Validator = {
    /**
     * Validate individual field with enhanced rules
     */
    validateField(fieldName, value, showErrors = true) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        if (!field || !errorElement) return false;

        let isValid = true;
        let errorMessage = '';

        // Clear previous states
        field.classList.remove('valid', 'invalid');
        if (showErrors) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }

        const sanitizedValue = Utils.sanitizeInput(value.trim());

        // Field-specific validation
        switch (fieldName) {
            case 'fullName':
                if (!sanitizedValue) {
                    isValid = false;
                    errorMessage = 'Full name is required';
                } else if (sanitizedValue.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                } else if (sanitizedValue.length > 50) {
                    isValid = false;
                    errorMessage = 'Name must be less than 50 characters';
                } else if (!AppState.validationRules.name.test(sanitizedValue)) {
                    isValid = false;
                    errorMessage = 'Name can only contain letters and spaces';
                }
                break;

            case 'workEmail':
                if (!sanitizedValue) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!AppState.validationRules.email.test(sanitizedValue)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                } else if (sanitizedValue.length > 254) {
                    isValid = false;
                    errorMessage = 'Email address is too long';
                }
                break;

            case 'password':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Password is required';
                } else if (value.length < 8) {
                    isValid = false;
                    errorMessage = 'Password must be at least 8 characters';
                } else if (value.length > 128) {
                    isValid = false;
                    errorMessage = 'Password must be less than 128 characters';
                } else if (!AppState.validationRules.password.test(value)) {
                    isValid = false;
                    errorMessage = 'Password must include uppercase, lowercase, number, and special character';
                }
                break;

            case 'collegeUrl':
                if (!sanitizedValue) {
                    isValid = false;
                    errorMessage = 'College website URL is required';
                } else if (!AppState.validationRules.url.test(sanitizedValue)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid URL (e.g., https://college.edu)';
                }
                break;

            case 'phoneNumber':
                const phoneValue = value.replace(/\D/g, '');
                if (!phoneValue) {
                    isValid = false;
                    errorMessage = 'Phone number is required';
                } else if (!AppState.validationRules.phone.test(phoneValue)) {
                    isValid = false;
                    errorMessage = 'Enter a valid 10-digit phone number starting with 6-9';
                }
                break;

            case 'loginEmail':
                if (!sanitizedValue) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!AppState.validationRules.email.test(sanitizedValue)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'loginPassword':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Password is required';
                }
                break;
        }

        // Apply validation state
        field.classList.add(isValid ? 'valid' : 'invalid');
        
        if (!isValid && showErrors) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
            field.setAttribute('aria-describedby', errorElement.id);
        } else {
            field.removeAttribute('aria-describedby');
        }

        return isValid;
    },

    /**
     * Validate OTP with enhanced security
     */
    validateOTP(otp) {
        const otpInput = document.getElementById('otpInput');
        const otpError = document.getElementById('otpError');
        const verifyBtn = document.getElementById('verifySignupBtn');

        if (!otpInput || !otpError || !verifyBtn) return false;

        otpInput.classList.remove('valid', 'invalid');
        otpError.classList.remove('show');

        if (otp.length === 6 && AppState.validationRules.otp.test(otp)) {
            if (otp === AppState.currentOTP) {
                otpInput.classList.add('valid');
                verifyBtn.disabled = false;
                return true;
            } else {
                otpInput.classList.add('invalid');
                otpError.textContent = 'Invalid OTP. Please check and try again.';
                otpError.classList.add('show');
                verifyBtn.disabled = true;
                return false;
            }
        } else {
            verifyBtn.disabled = true;
            return false;
        }
    }
};

// Password strength calculator
const PasswordStrength = {
    /**
     * Calculate password strength with detailed criteria
     */
    calculate(password) {
        let score = 0;
        let feedback = [];

        // Length check
        if (password.length >= 8) score += 1;
        else feedback.push('at least 8 characters');

        if (password.length >= 12) score += 1;

        // Character variety
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('lowercase letters');

        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('uppercase letters');

        if (/\d/.test(password)) score += 1;
        else feedback.push('numbers');

        if (/[^A-Za-z\d]/.test(password)) score += 1;
        else feedback.push('special characters');

        // Common patterns (reduce score)
        if (/(.)\1{2,}/.test(password)) score -= 1; // Repeated characters
        if (/123|abc|qwe/i.test(password)) score -= 1; // Sequential patterns

        const levels = {
            0: { class: 'weak', text: 'Very Weak', color: '#EF4444' },
            1: { class: 'weak', text: 'Weak', color: '#EF4444' },
            2: { class: 'fair', text: 'Fair', color: '#F59E0B' },
            3: { class: 'fair', text: 'Fair', color: '#F59E0B' },
            4: { class: 'good', text: 'Good', color: '#3B82F6' },
            5: { class: 'strong', text: 'Strong', color: '#10B981' },
            6: { class: 'strong', text: 'Very Strong', color: '#10B981' }
        };

        const level = Math.max(0, Math.min(6, score));
        return {
            score: level,
            ...levels[level],
            feedback: feedback.length > 0 ? `Add: ${feedback.join(', ')}` : 'Password meets requirements'
        };
    },

    /**
     * Update password strength UI
     */
    updateUI(password) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');

        if (!strengthFill || !strengthText) return;

        const strength = this.calculate(password);
        
        strengthFill.className = `strength-fill ${strength.class}`;
        strengthFill.style.backgroundColor = strength.color;
        strengthText.textContent = `${strength.text} - ${strength.feedback}`;
        strengthText.style.color = strength.color;
    }
};

// Form handlers
const FormHandlers = {
    /**
     * Initialize signup form
     */
    initSignup() {
        const form = document.getElementById('signupForm');
        if (!form) return;

        const fields = ['fullName', 'workEmail', 'password', 'collegeUrl', 'phoneNumber'];
        const getOtpBtn = document.getElementById('getOtpBtn');
        const otpInput = document.getElementById('otpInput');
        const passwordField = document.getElementById('password');
        const passwordToggle = document.getElementById('passwordToggle');

        // Real-time validation with debouncing
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!field) return;

            const debouncedValidation = Utils.debounce(() => {
                Validator.validateField(fieldName, field.value);
                this.updateSignupButtonState();
            }, 300, `validation_${fieldName}`);

            field.addEventListener('input', debouncedValidation);
            field.addEventListener('blur', () => {
                Validator.validateField(fieldName, field.value);
                this.updateSignupButtonState();
            });
        });

        // Password strength monitoring
        if (passwordField) {
            passwordField.addEventListener('input', (e) => {
                PasswordStrength.updateUI(e.target.value);
            });
        }

        // Password visibility toggle
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => {
                this.togglePasswordVisibility('password', passwordToggle);
            });
        }

        // Phone number formatting
        const phoneField = document.getElementById('phoneNumber');
        if (phoneField) {
            phoneField.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
            });
        }

        // OTP handling
        if (getOtpBtn) {
            getOtpBtn.addEventListener('click', this.handleGetOTP.bind(this));
        }

        if (otpInput) {
            otpInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
                Validator.validateOTP(e.target.value);
            });
        }

        // Form submission
        form.addEventListener('submit', this.handleSignupSubmit.bind(this));
    },

    /**
     * Initialize login form
     */
    initLogin() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        const loginEmail = document.getElementById('loginEmail');
        const loginPassword = document.getElementById('loginPassword');
        const passwordToggle = document.getElementById('loginPasswordToggle');
        const rememberMe = document.getElementById('rememberMe');

        // Load remembered email
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail && loginEmail) {
            loginEmail.value = rememberedEmail;
            if (rememberMe) rememberMe.checked = true;
            this.updateLoginButtonState();
        }

        // Real-time validation
        [loginEmail, loginPassword].forEach(field => {
            if (!field) return;
            
            const debouncedValidation = Utils.debounce(() => {
                Validator.validateField(field.name, field.value, false);
                this.updateLoginButtonState();
            }, 200, `login_${field.name}`);

            field.addEventListener('input', debouncedValidation);
        });

        // Password visibility toggle
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => {
                this.togglePasswordVisibility('loginPassword', passwordToggle);
            });
        }

        // Form submission
        form.addEventListener('submit', this.handleLoginSubmit.bind(this));
    },

    /**
     * Toggle password visibility with accessibility
     */
    togglePasswordVisibility(fieldId, toggleButton) {
        const field = document.getElementById(fieldId);
        const eyeIcon = toggleButton.querySelector('.eye-icon');
        
        if (!field || !eyeIcon) return;

        const isPassword = field.type === 'password';
        field.type = isPassword ? 'text' : 'password';
        eyeIcon.textContent = isPassword ? '🙈' : '👁️';
        toggleButton.setAttribute('aria-label', 
            isPassword ? 'Hide password' : 'Show password'
        );
    },

    /**
     * Update signup button state
     */
    updateSignupButtonState() {
        const getOtpBtn = document.getElementById('getOtpBtn');
        if (!getOtpBtn) return;

        const fields = ['fullName', 'workEmail', 'password', 'collegeUrl', 'phoneNumber'];
        const allValid = fields.every(fieldName => {
            const field = document.getElementById(fieldName);
            return field && field.classList.contains('valid');
        });

        getOtpBtn.disabled = !allValid;
    },

    /**
     * Update login button state
     */
    updateLoginButtonState() {
        const loginBtn = document.getElementById('loginBtn');
        const loginEmail = document.getElementById('loginEmail');
        const loginPassword = document.getElementById('loginPassword');

        if (!loginBtn || !loginEmail || !loginPassword) return;

        const emailValid = loginEmail.value.trim() && 
                          AppState.validationRules.email.test(loginEmail.value);
        const passwordValid = loginPassword.value.length > 0;

        loginBtn.disabled = !(emailValid && passwordValid);
    },

    /**
     * Handle OTP generation with enhanced security
     */
    async handleGetOTP() {
        const getOtpBtn = document.getElementById('getOtpBtn');
        const otpSection = document.getElementById('otpSection');
        const otpModal = document.getElementById('otpModal');
        const otpDisplay = document.getElementById('otpDisplay');
        const closeModal = document.getElementById('closeModal');

        if (!getOtpBtn) return;

        // Show loading state
        getOtpBtn.classList.add('loading');
        getOtpBtn.disabled = true;

        // Disable form temporarily
        const formInputs = document.querySelectorAll('#signupForm input');
        formInputs.forEach(input => input.disabled = true);

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Generate secure OTP
            AppState.currentOTP = Utils.generateSecureOTP();

            // Store form data
            AppState.signupData = {
                fullName: document.getElementById('fullName').value,
                workEmail: document.getElementById('workEmail').value,
                password: document.getElementById('password').value,
                collegeUrl: document.getElementById('collegeUrl').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                timestamp: Date.now()
            };

            // Display OTP modal
            if (otpDisplay) otpDisplay.textContent = AppState.currentOTP;
            if (otpModal) otpModal.classList.add('show');

            // Setup modal close handler
            if (closeModal) {
                closeModal.onclick = () => {
                    if (otpModal) otpModal.classList.remove('show');
                    setTimeout(() => {
                        if (otpSection) {
                            otpSection.classList.add('show');
                            const otpInput = document.getElementById('otpInput');
                            if (otpInput) otpInput.focus();
                        }
                    }, 300);
                };
            }

            Utils.showNotification('OTP generated successfully!', 'success');

        } catch (error) {
            console.error('OTP generation error:', error);
            Utils.showNotification('Failed to generate OTP. Please try again.', 'error');
        } finally {
            // Re-enable form
            formInputs.forEach(input => input.disabled = false);
            getOtpBtn.classList.remove('loading');
        }
    },

    /**
     * Handle signup submission with enhanced security
     */
    async handleSignupSubmit(e) {
        e.preventDefault();

        const verifyBtn = document.getElementById('verifySignupBtn');
        const otpInput = document.getElementById('otpInput');
        const successMessage = document.getElementById('successMessage');

        if (!verifyBtn || !otpInput) return;

        // Final OTP validation
        if (!Validator.validateOTP(otpInput.value)) {
            Utils.showNotification('Please enter a valid OTP', 'error');
            return;
        }

        // Check OTP expiry (5 minutes)
        const otpAge = Date.now() - AppState.signupData.timestamp;
        if (otpAge > 300000) { // 5 minutes
            Utils.showNotification('OTP has expired. Please request a new one.', 'error');
            return;
        }

        verifyBtn.classList.add('loading');
        verifyBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Hash password for storage
            const hashedPassword = await Utils.hashPassword(AppState.signupData.password);

            // Prepare user data
            const userData = {
                ...AppState.signupData,
                password: hashedPassword,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                isVerified: true,
                lastLogin: null
            };

            // Store in localStorage (simulate database)
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            
            // Check for existing user
            const existingUser = users.find(u => u.workEmail === userData.workEmail);
            if (existingUser) {
                throw new Error('User already exists with this email');
            }

            users.push(userData);
            localStorage.setItem('registeredUsers', JSON.stringify(users));

            // Show success message
            if (successMessage) successMessage.classList.add('show');

            // Clear sensitive data
            AppState.currentOTP = '';
            AppState.signupData = {};

            Utils.showNotification('Account created successfully!', 'success');

            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);

        } catch (error) {
            console.error('Signup error:', error);
            Utils.showNotification(error.message || 'Failed to create account. Please try again.', 'error');
        } finally {
            verifyBtn.classList.remove('loading');
            verifyBtn.disabled = false;
        }
    },

    /**
     * Handle login with enhanced security
     */
    async handleLoginSubmit(e) {
        e.preventDefault();

        const loginBtn = document.getElementById('loginBtn');
        const loginError = document.getElementById('loginError');
        const loginEmail = document.getElementById('loginEmail');
        const loginPassword = document.getElementById('loginPassword');
        const rememberMe = document.getElementById('rememberMe');
        const successMessage = document.getElementById('loginSuccessMessage');

        if (!loginBtn || !loginEmail || !loginPassword) return;

        // Clear previous errors
        if (loginError) loginError.classList.remove('show');

        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1200));

            // Get registered users
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            
            // Hash provided password for comparison
            const hashedPassword = await Utils.hashPassword(loginPassword.value);
            
            // Find user
            const user = users.find(u => 
                u.workEmail === loginEmail.value && u.password === hashedPassword
            );

            if (user) {
                // Successful login
                
                // Update last login
                user.lastLogin = new Date().toISOString();
                const userIndex = users.findIndex(u => u.id === user.id);
                users[userIndex] = user;
                localStorage.setItem('registeredUsers', JSON.stringify(users));

                // Handle remember me
                if (rememberMe && rememberMe.checked) {
                    localStorage.setItem('rememberedEmail', loginEmail.value);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                // Set session
                const sessionData = {
                    userId: user.id,
                    email: user.workEmail,
                    fullName: user.fullName,
                    loginTime: new Date().toISOString(),
                    sessionId: crypto.randomUUID()
                };
                
                localStorage.setItem('currentSession', JSON.stringify(sessionData));
                sessionStorage.setItem('isAuthenticated', 'true');

                // Show success
                if (successMessage) successMessage.classList.add('show');

                Utils.showNotification(`Welcome back, ${user.fullName}!`, 'success');

                // Create and redirect to dashboard
                this.createDashboard();
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);

            } else {
                // Failed login
                const errorMsg = 'Invalid email or password. Please check your credentials and try again.';
                if (loginError) {
                    loginError.textContent = errorMsg;
                    loginError.classList.add('show');
                }
                Utils.showNotification('Login failed', 'error');
            }

        } catch (error) {
            console.error('Login error:', error);
            const errorMsg = 'An error occurred during login. Please try again.';
            if (loginError) {
                loginError.textContent = errorMsg;
                loginError.classList.add('show');
            }
            Utils.showNotification('Login error occurred', 'error');
        } finally {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    },

    /**
     * Create dashboard with enhanced features
     */
    createDashboard() {
        const session = JSON.parse(localStorage.getItem('currentSession') || '{}');
        
        const dashboardHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - College Chatbot</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <style>
        .dashboard-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .dashboard-header { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin-bottom: 30px; }
        .dashboard-welcome { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
        .user-info h1 { color: #1F2937; margin-bottom: 5px; }
        .user-info p { color: #6B7280; font-size: 14px; }
        .session-info { font-size: 12px; color: #9CA3AF; margin-top: 5px; }
        .logout-btn { background: #EF4444; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.3s ease; }
        .logout-btn:hover { background: #DC2626; transform: translateY(-1px); }
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 30px; }
        .dashboard-card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease; }
        .dashboard-card:hover { transform: translateY(-5px); }
        .card-icon { width: 50px; height: 50px; background: linear-gradient(135deg, #005A9C, #3B82F6); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; margin-bottom: 20px; }
        .card-title { font-size: 18px; font-weight: 600; color: #1F2937; margin-bottom: 15px; }
        .card-content { color: #6B7280; line-height: 1.6; margin-bottom: 20px; }
        .card-action { background: #005A9C; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; transition: background 0.3s ease; }
        .card-action:hover { background: #004580; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 32px; font-weight: 600; color: #005A9C; margin-bottom: 5px; }
        .stat-label { color: #6B7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <div class="dashboard-header">
            <div class="dashboard-welcome">
                <div class="user-info">
                    <h1>Welcome back, ${session.fullName || 'Admin'}!</h1>
                    <p>College Chatbot Admin Dashboard</p>
                    <div class="session-info">Session started: ${new Date(session.loginTime).toLocaleString()}</div>
                </div>
                <button class="logout-btn" onclick="logout()">Logout</button>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">1,247</div>
                <div class="stat-label">Total Conversations</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">89%</div>
                <div class="stat-label">Success Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">156</div>
                <div class="stat-label">Active Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">24</div>
                <div class="stat-label">Avg Response Time (s)</div>
            </div>
        </div>
        
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <div class="card-icon">🤖</div>
                <h3 class="card-title">Chatbot Management</h3>
                <div class="card-content">Configure responses, train the AI model, and manage conversation flows for your college chatbot.</div>
                <button class="card-action">Manage Bot</button>
            </div>
            
            <div class="dashboard-card">
                <div class="card-icon">📊</div>
                <h3 class="card-title">Analytics & Reports</h3>
                <div class="card-content">View detailed analytics, conversation metrics, and generate comprehensive reports.</div>
                <button class="card-action">View Analytics</button>
            </div>
            
            <div class="dashboard-card">
                <div class="card-icon">👥</div>
                <h3 class="card-title">User Management</h3>
                <div class="card-content">Manage student accounts, set permissions, and monitor user activity across the platform.</div>
                <button class="card-action">Manage Users</button>
            </div>
            
            <div class="dashboard-card">
                <div class="card-icon">⚙️</div>
                <h3 class="card-title">System Settings</h3>
                <div class="card-content">Configure system preferences, integration settings, and security options.</div>
                <button class="card-action">Open Settings</button>
            </div>
            
            <div class="dashboard-card">
                <div class="card-icon">📚</div>
                <h3 class="card-title">Knowledge Base</h3>
                <div class="card-content">Manage FAQ database, course information, and educational content for the chatbot.</div>
                <button class="card-action">Edit Content</button>
            </div>
            
            <div class="dashboard-card">
                <div class="card-icon">🔔</div>
                <h3 class="card-title">Notifications</h3>
                <div class="card-content">Configure alert settings, manage notification preferences, and review system messages.</div>
                <button class="card-action">View Alerts</button>
            </div>
        </div>
    </div>
    
    <script>
        function logout() {
            localStorage.removeItem('currentSession');
            sessionStorage.removeItem('isAuthenticated');
            window.location.href = 'login.html';
        }
        
        // Auto-logout after 30 minutes of inactivity
        let inactivityTimer;
        function resetInactivityTimer() {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(logout, 30 * 60 * 1000);
        }
        
        document.addEventListener('click', resetInactivityTimer);
        document.addEventListener('keypress', resetInactivityTimer);
        resetInactivityTimer();
    </script>
</body>
</html>`;
        
        // Store dashboard HTML
        localStorage.setItem('dashboardHTML', dashboardHTML);
    }
};

// Security and session management
const Security = {
    /**
     * Check authentication status
     */
    checkAuth() {
        const session = localStorage.getItem('currentSession');
        const isAuth = sessionStorage.getItem('isAuthenticated');
        
        if (!session || !isAuth) {
            if (window.location.pathname.includes('dashboard')) {
                window.location.href = 'login.html';
            }
            return false;
        }
        
        // Check session expiry (24 hours)
        const sessionData = JSON.parse(session);
        const loginTime = new Date(sessionData.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
            this.clearSession();
            if (window.location.pathname.includes('dashboard')) {
                window.location.href = 'login.html';
            }
            return false;
        }
        
        return true;
    },

    /**
     * Clear session data
     */
    clearSession() {
        localStorage.removeItem('currentSession');
        sessionStorage.removeItem('isAuthenticated');
    },

    /**
     * Initialize security measures
     */
    init() {
        // Check auth on page load
        this.checkAuth();
        
        // Check auth on navigation
        window.addEventListener('popstate', () => this.checkAuth());
        
        // Prevent common attacks
        this.preventXSS();
        this.setupCSP();
    },

    /**
     * Prevent XSS attacks
     */
    preventXSS() {
        // Sanitize URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.forEach((value, key) => {
            if (/<script|javascript:/i.test(value)) {
                window.location.href = '/';
            }
        });
    },

    /**
     * Setup Content Security Policy
     */
    setupCSP() {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;";
        document.head.appendChild(meta);
    }
};

// Application initialization
const App = {
    /**
     * Initialize the application
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    },

    /**
     * Start the application
     */
    start() {
        // Initialize security
        Security.init();

        // Initialize forms based on current page
        const signupForm = document.getElementById('signupForm');
        const loginForm = document.getElementById('loginForm');

        if (signupForm) {
            FormHandlers.initSignup();
        }

        if (loginForm) {
            FormHandlers.initLogin();
        }

        // Add global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            Utils.showNotification('An unexpected error occurred', 'error');
        });

        // Add unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            Utils.showNotification('An error occurred processing your request', 'error');
        });

        console.log('College Chatbot Authentication System initialized');
    }
};

// Initialize the application
App.init();

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Utils, Validator, PasswordStrength, FormHandlers, Security, App };
}
