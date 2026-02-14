// ============================================
// MATCHLY - MAIN APPLICATION JAVASCRIPT
// ============================================

// API Configuration (Replace with your actual API endpoints)
const API_CONFIG = {
    baseURL: 'https://api.matchly.com/v1',
    googleClientId: 'YOUR_GOOGLE_CLIENT_ID',
    facebookAppId: 'YOUR_FACEBOOK_APP_ID',
    appleClientId: 'YOUR_APPLE_CLIENT_ID'
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const Utils = {
    // Show alert message
    showAlert: (elementId, message, type = 'error') => {
        const alert = document.getElementById(elementId);
        if (alert) {
            alert.className = `alert alert-${type}`;
            alert.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle'}"></i>
                ${message}
            `;
            alert.style.display = 'flex';
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                alert.style.display = 'none';
            }, 5000);
        }
    },

    // Hide alert
    hideAlert: (elementId) => {
        const alert = document.getElementById(elementId);
        if (alert) {
            alert.style.display = 'none';
        }
    },

    // Set loading state
    setLoading: (buttonId, isLoading) => {
        const button = document.getElementById(buttonId);
        if (button) {
            const btnText = button.querySelector('.btn-text');
            const spinner = button.querySelector('.spinner');
            
            if (isLoading) {
                button.disabled = true;
                if (btnText) btnText.style.display = 'none';
                if (spinner) spinner.style.display = 'inline-block';
            } else {
                button.disabled = false;
                if (btnText) btnText.style.display = 'inline';
                if (spinner) spinner.style.display = 'none';
            }
        }
    },

    // Validate email
    isValidEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate password
    isValidPassword: (password) => {
        return password.length >= 6;
    },

    // Save user session
    saveUserSession: (userData, remember = false) => {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(userData));
        storage.setItem('token', userData.token || 'demo-token');
    },

    // Get user session
    getUserSession: () => {
        let user = localStorage.getItem('user') || sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Clear user session
    clearUserSession: () => {
        localStorage.clear();
        sessionStorage.clear();
    },

    // Check if user has profile
    hasProfile: (user) => {
        return user && user.hasProfile === true;
    }
};

// ============================================
// PAGE INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Check current page and initialize accordingly
    const path = window.location.pathname;
    
    if (path.includes('login.html')) {
        initLoginPage();
    } else if (path.includes('signup.html')) {
        initSignupPage();
    } else if (path.includes('profile.html')) {
        initProfilePage();
    } else if (path.includes('index.html') || path === '/' || path === '') {
        initWelcomePage();
    }
    
    // Initialize common elements
    initCommon();
});

// ============================================
// WELCOME PAGE
// ============================================

function initWelcomePage() {
    console.log('Welcome page initialized');
    
    // Social login buttons
    document.getElementById('googleBtn')?.addEventListener('click', () => {
        handleSocialLogin('google', 'welcome');
    });
    
    document.getElementById('facebookBtn')?.addEventListener('click', () => {
        handleSocialLogin('facebook', 'welcome');
    });
    
    document.getElementById('appleBtn')?.addEventListener('click', () => {
        handleSocialLogin('apple', 'welcome');
    });
}

// ============================================
// LOGIN PAGE
// ============================================

function initLoginPage() {
    console.log('Login page initialized');
    
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const forgotPassword = document.getElementById('forgotPassword');
    
    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // Forgot password
    if (forgotPassword) {
        forgotPassword.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email')?.value;
            
            if (!email || !Utils.isValidEmail(email)) {
                Utils.showAlert('loginAlert', 'Please enter a valid email address', 'error');
                return;
            }
            
            try {
                // Simulate API call
                Utils.setLoading('forgotPassword', true);
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                Utils.showAlert('loginAlert', 'Password reset link sent to your email!', 'success');
            } catch (error) {
                Utils.showAlert('loginAlert', 'Failed to send reset link. Please try again.', 'error');
            } finally {
                Utils.setLoading('forgotPassword', false);
            }
        });
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe')?.checked || false;
            
            // Validate
            if (!email || !password) {
                Utils.showAlert('loginAlert', 'Please fill in all fields', 'error');
                return;
            }
            
            if (!Utils.isValidEmail(email)) {
                Utils.showAlert('loginAlert', 'Please enter a valid email address', 'error');
                return;
            }
            
            if (!Utils.isValidPassword(password)) {
                Utils.showAlert('loginAlert', 'Password must be at least 6 characters', 'error');
                return;
            }
            
            // Show loading
            Utils.setLoading('loginBtn', true);
            Utils.hideAlert('loginAlert');
            
            try {
                // Simulate API call - Replace with actual API
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Mock response
                const response = {
                    success: true,
                    user: {
                        id: '123',
                        email: email,
                        name: 'John Doe',
                        hasProfile: false, // Set to true if user has profile
                        token: 'demo-token-123'
                    }
                };
                
                if (response.success) {
                    // Save user session
                    Utils.saveUserSession(response.user, rememberMe);
                    
                    // Show success
                    Utils.showAlert('loginAlert', 'Login successful! Redirecting...', 'success');
                    
                    // Redirect based on profile status
                    setTimeout(() => {
                        if (response.user.hasProfile) {
                            window.location.href = 'chat.html'; // Will create later
                        } else {
                            window.location.href = 'profile.html';
                        }
                    }, 1500);
                } else {
                    Utils.showAlert('loginAlert', response.message || 'Invalid email or password', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                Utils.showAlert('loginAlert', 'Network error. Please try again.', 'error');
            } finally {
                Utils.setLoading('loginBtn', false);
            }
        });
    }
    
    // Social login
    document.getElementById('googleLogin')?.addEventListener('click', () => handleSocialLogin('google', 'login'));
    document.getElementById('facebookLogin')?.addEventListener('click', () => handleSocialLogin('facebook', 'login'));
    document.getElementById('appleLogin')?.addEventListener('click', () => handleSocialLogin('apple', 'login'));
}

// ============================================
// SIGNUP PAGE
// ============================================

function initSignupPage() {
    console.log('Signup page initialized');
    
    const signupForm = document.getElementById('signupForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate
            if (!fullName || !email || !password || !confirmPassword) {
                Utils.showAlert('signupAlert', 'Please fill in all fields', 'error');
                return;
            }
            
            if (fullName.length < 2) {
                Utils.showAlert('signupAlert', 'Please enter your full name', 'error');
                return;
            }
            
            if (!Utils.isValidEmail(email)) {
                Utils.showAlert('signupAlert', 'Please enter a valid email address', 'error');
                return;
            }
            
            if (!Utils.isValidPassword(password)) {
                Utils.showAlert('signupAlert', 'Password must be at least 6 characters', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                Utils.showAlert('signupAlert', 'Passwords do not match', 'error');
                return;
            }
            
            // Show loading
            Utils.setLoading('signupBtn', true);
            Utils.hideAlert('signupAlert');
            
            try {
                // Simulate API call - Replace with actual API
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Mock response
                const response = {
                    success: true,
                    user: {
                        id: '123',
                        email: email,
                        name: fullName,
                        hasProfile: false,
                        token: 'demo-token-123'
                    }
                };
                
                if (response.success) {
                    // Save user session
                    Utils.saveUserSession(response.user);
                    
                    // Show success
                    Utils.showAlert('signupAlert', 'Account created successfully! Redirecting...', 'success');
                    
                    // Redirect to profile setup
                    setTimeout(() => {
                        window.location.href = 'profile.html';
                    }, 1500);
                } else {
                    Utils.showAlert('signupAlert', response.message || 'Failed to create account', 'error');
                }
            } catch (error) {
                console.error('Signup error:', error);
                Utils.showAlert('signupAlert', 'Network error. Please try again.', 'error');
            } finally {
                Utils.setLoading('signupBtn', false);
            }
        });
    }
    
    // Social signup
    document.getElementById('googleSignup')?.addEventListener('click', () => handleSocialLogin('google', 'signup'));
    document.getElementById('facebookSignup')?.addEventListener('click', () => handleSocialLogin('facebook', 'signup'));
    document.getElementById('appleSignup')?.addEventListener('click', () => handleSocialLogin('apple', 'signup'));
}

// ============================================
// PROFILE PAGE
// ============================================

function initProfilePage() {
    console.log('Profile page initialized');
    
    // Check if user is logged in
    const user = Utils.getUserSession();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // State management
    let currentStep = 1;
    let uploadedPhotos = [];
    let selectedInterests = [];
    
    // DOM Elements
    const step1Card = document.getElementById('step1Card');
    const step2Card = document.getElementById('step2Card');
    const step3Card = document.getElementById('step3Card');
    const step4Card = document.getElementById('step4Card');
    
    const progressFill = document.getElementById('progressFill');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step4 = document.getElementById('step4');
    
    // Photo Upload
    const photoBoxes = [
        document.getElementById('photoBox1'),
        document.getElementById('photoBox2'),
        document.getElementById('photoBox3')
    ];
    
    const photoInputs = [
        document.getElementById('photoInput1'),
        document.getElementById('photoInput2'),
        document.getElementById('photoInput3')
    ];
    
    // Photo upload handlers
    photoBoxes.forEach((box, index) => {
        box.addEventListener('click', () => {
            photoInputs[index].click();
        });
    });
    
    photoInputs.forEach((input, index) => {
        input.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    Utils.showAlert('profileAlert', 'Please upload an image file', 'error');
                    return;
                }
                
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    Utils.showAlert('profileAlert', 'File size must be less than 5MB', 'error');
                    return;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const box = photoBoxes[index];
                    box.innerHTML = `
                        <div class="photo-preview">
                            <img src="${e.target.result}" alt="Upload">
                            <button class="remove-photo" onclick="window.removePhoto(${index})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                    box.classList.add('has-image');
                    
                    uploadedPhotos[index] = file;
                    
                    // Enable next button if at least 2 photos
                    const nextBtn = document.getElementById('nextToBasic');
                    if (nextBtn) {
                        nextBtn.disabled = uploadedPhotos.filter(p => p).length < 2;
                    }
                };
                
                reader.readAsDataURL(file);
            }
        });
    });
    
    // Remove photo function
    window.removePhoto = function(index) {
        uploadedPhotos[index] = null;
        const box = photoBoxes[index];
        box.innerHTML = `
            <i class="fas fa-camera"></i>
            <span>Add Photo</span>
            <input type="file" accept="image/*" id="photoInput${index + 1}" style="display: none;">
        `;
        box.classList.remove('has-image');
        
        // Reattach input
        const newInput = document.getElementById(`photoInput${index + 1}`);
        newInput.addEventListener('change', photoInputs[index].onchange);
        photoInputs[index] = newInput;
        
        // Update next button
        const nextBtn = document.getElementById('nextToBasic');
        if (nextBtn) {
            nextBtn.disabled = uploadedPhotos.filter(p => p).length < 2;
        }
    };
    
    // Skip photos
    document.getElementById('skipPhotos')?.addEventListener('click', () => {
        if (confirm('Skipping photos now will limit your matches. You can add them later in settings. Continue?')) {
            goToStep(2);
        }
    });
    
    // Navigation functions
    function goToStep(step) {
        currentStep = step;
        
        // Hide all cards
        step1Card.style.display = 'none';
        step2Card.style.display = 'none';
        step3Card.style.display = 'none';
        step4Card.style.display = 'none';
        
        // Show current card
        document.getElementById(`step${step}Card`).style.display = 'block';
        
        // Update progress bar
        if (progressFill) {
            progressFill.style.width = `${step * 25}%`;
        }
        
        // Update step indicators
        const steps = [step1, step2, step3, step4];
        steps.forEach((el, i) => {
            if (el) {
                if (i + 1 < step) {
                    el.className = 'step completed';
                } else if (i + 1 === step) {
                    el.className = 'step active';
                } else {
                    el.className = 'step';
                }
            }
        });
    }
    
    // Back buttons
    document.getElementById('backToPhotos')?.addEventListener('click', () => goToStep(1));
    document.getElementById('backToBasic')?.addEventListener('click', () => goToStep(2));
    document.getElementById('backToAbout')?.addEventListener('click', () => goToStep(3));
    
    // Next buttons
    document.getElementById('nextToBasic')?.addEventListener('click', () => goToStep(2));
    
    document.getElementById('nextToAbout')?.addEventListener('click', () => {
        // Validate basic info
        const firstName = document.getElementById('firstName')?.value;
        const lastName = document.getElementById('lastName')?.value;
        const age = document.getElementById('age')?.value;
        const gender = document.getElementById('gender')?.value;
        const country = document.getElementById('country')?.value;
        const city = document.getElementById('city')?.value;
        
        if (!firstName || !lastName || !age || !gender || !country || !city) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (age < 18) {
            alert('You must be at least 18 years old');
            return;
        }
        
        goToStep(3);
    });
    
    document.getElementById('nextToInterests')?.addEventListener('click', () => {
        const bio = document.getElementById('bio')?.value;
        
        if (!bio || bio.length < 20) {
            alert('Please write a bio with at least 20 characters');
            return;
        }
        
        goToStep(4);
    });
    
    // Interest selection
    const interestTags = document.querySelectorAll('.interest-tag');
    const completeBtn = document.getElementById('completeProfile');
    
    interestTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const interest = this.textContent;
            
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                selectedInterests = selectedInterests.filter(i => i !== interest);
            } else {
                this.classList.add('selected');
                selectedInterests.push(interest);
            }
            
            if (completeBtn) {
                completeBtn.disabled = selectedInterests.length < 5;
            }
            
            // Show count
            const remaining = 5 - selectedInterests.length;
            if (remaining > 0) {
                const alert = document.getElementById('interestsAlert');
                alert.className = 'alert alert-info';
                alert.innerHTML = `<i class="fas fa-info-circle"></i> Select ${remaining} more interest${remaining > 1 ? 's' : ''}`;
                alert.style.display = 'flex';
            } else {
                document.getElementById('interestsAlert').style.display = 'none';
            }
        });
    });
    
    // Complete profile
    if (completeBtn) {
        completeBtn.addEventListener('click', async function() {
            if (selectedInterests.length < 5) {
                alert('Please select at least 5 interests');
                return;
            }
            
            // Show loading
            this.disabled = true;
            this.innerHTML = '<span class="spinner" style="display: inline-block;"></span> Saving Profile...';
            
            try {
                // Collect all profile data
                const profileData = {
                    photos: uploadedPhotos.map(p => p ? 'photo-data' : null),
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    age: document.getElementById('age').value,
                    gender: document.getElementById('gender').value,
                    country: document.getElementById('country').value,
                    city: document.getElementById('city').value,
                    jobTitle: document.getElementById('jobTitle').value,
                    company: document.getElementById('company').value,
                    education: document.getElementById('education').value,
                    bio: document.getElementById('bio').value,
                    height: document.getElementById('height').value,
                    exercise: document.getElementById('exercise').value,
                    drinking: document.getElementById('drinking').value,
                    smoking: document.getElementById('smoking').value,
                    kids: document.getElementById('kids').value,
                    languages: document.getElementById('languages').value,
                    interests: selectedInterests
                };
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Update user session
                const user = Utils.getUserSession();
                user.hasProfile = true;
                Utils.saveUserSession(user);
                
                alert('Profile completed successfully!');
                window.location.href = 'chat.html'; // Will create later
            } catch (error) {
                console.error('Profile save error:', error);
                alert('Failed to save profile. Please try again.');
                this.disabled = false;
                this.innerHTML = 'Complete Profile';
            }
        });
    }
    
    // Location detection
    document.getElementById('detectLocation')?.addEventListener('click', function() {
        if (navigator.geolocation) {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    // Reverse geocoding would go here
                    document.getElementById('city').value = 'New York';
                    document.getElementById('country').value = 'USA';
                    this.innerHTML = '<i class="fas fa-crosshairs"></i>';
                },
                (error) => {
                    alert('Could not detect location. Please enter manually.');
                    this.innerHTML = '<i class="fas fa-crosshairs"></i>';
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    });
    
    // Bio character count
    const bioInput = document.getElementById('bio');
    const bioCount = document.getElementById('bioCount');
    
    if (bioInput && bioCount) {
        bioInput.addEventListener('input', function() {
            const count = this.value.length;
            bioCount.textContent = `${count}/500`;
            
            if (count > 500) {
                this.value = this.value.substring(0, 500);
                bioCount.textContent = '500/500';
            }
        });
    }
}

// ============================================
// COMMON FUNCTIONS
// ============================================

function initCommon() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .social-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('no-ripple')) return;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ============================================
// SOCIAL LOGIN HANDLER
// ============================================

async function handleSocialLogin(provider, source) {
    console.log(`Initiating ${provider} login from ${source}`);
    
    const alertId = source === 'login' ? 'loginAlert' : source === 'signup' ? 'signupAlert' : null;
    
    if (alertId) {
        Utils.showAlert(alertId, `Connecting to ${provider}...`, 'info');
    }
    
    try {
        // Simulate OAuth flow
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock success
        if (alertId) {
            Utils.showAlert(alertId, `${provider} login successful! Redirecting...`, 'success');
        }
        
        // Create mock user
        const user = {
            id: '123',
            email: `user@${provider}.com`,
            name: `${provider} User`,
            hasProfile: false,
            token: 'demo-token-123'
        };
        
        Utils.saveUserSession(user);
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    } catch (error) {
        console.error(`${provider} login error:`, error);
        if (alertId) {
            Utils.showAlert(alertId, `Failed to login with ${provider}. Please try again.`, 'error');
        }
    }
}

// ============================================
// ADD RIPPLE STYLES
// ============================================

const style = document.createElement('style');
style.textContent = `
    .btn, .social-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

document.head.appendChild(style);