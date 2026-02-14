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
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-exclamation-circle'}"></i>
                ${message}
            `;
            alert.style.display = 'flex';
            
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

    // Calculate age from date of birth
    calculateAge: (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    },

    // Save user session
    saveUserSession: (userData, remember = false) => {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(userData));
        storage.setItem('token', userData.token || 'demo-token-123');
    },

    // Get user session
    getUserSession: () => {
        let user = localStorage.getItem('user') || sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Update user session
    updateUserSession: (updates) => {
        const user = Utils.getUserSession();
        if (user) {
            Object.assign(user, updates);
            localStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('user', JSON.stringify(user));
        }
    },

    // Clear user session
    clearUserSession: () => {
        localStorage.clear();
        sessionStorage.clear();
    },

    // Check if user has profile
    hasProfile: (user) => {
        return user && user.hasProfile === true;
    },

    // Format date for display
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
            
            Utils.showAlert('loginAlert', 'Password reset link sent to your email!', 'success');
        });
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe')?.checked || false;
            
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
            
            Utils.setLoading('loginBtn', true);
            Utils.hideAlert('loginAlert');
            
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                const response = {
                    success: true,
                    user: {
                        id: '123',
                        email: email,
                        name: 'John Doe',
                        hasProfile: false,
                        token: 'demo-token-123'
                    }
                };
                
                if (response.success) {
                    Utils.saveUserSession(response.user, rememberMe);
                    
                    Utils.showAlert('loginAlert', 'Login successful! Redirecting...', 'success');
                    
                    setTimeout(() => {
                        if (response.user.hasProfile) {
                            window.location.href = 'home.html';
                        } else {
                            window.location.href = 'profile.html';
                        }
                    }, 1500);
                } else {
                    Utils.showAlert('loginAlert', response.message || 'Invalid email or password', 'error');
                }
            } catch (error) {
                Utils.showAlert('loginAlert', 'Network error. Please try again.', 'error');
            } finally {
                Utils.setLoading('loginBtn', false);
            }
        });
    }
    
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
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
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
            
            Utils.setLoading('signupBtn', true);
            Utils.hideAlert('signupAlert');
            
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                
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
                    Utils.saveUserSession(response.user);
                    
                    Utils.showAlert('signupAlert', 'Account created successfully! Redirecting...', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'profile.html';
                    }, 1500);
                } else {
                    Utils.showAlert('signupAlert', response.message || 'Failed to create account', 'error');
                }
            } catch (error) {
                Utils.showAlert('signupAlert', 'Network error. Please try again.', 'error');
            } finally {
                Utils.setLoading('signupBtn', false);
            }
        });
    }
    
    document.getElementById('googleSignup')?.addEventListener('click', () => handleSocialLogin('google', 'signup'));
    document.getElementById('facebookSignup')?.addEventListener('click', () => handleSocialLogin('facebook', 'signup'));
    document.getElementById('appleSignup')?.addEventListener('click', () => handleSocialLogin('apple', 'signup'));
}

// ============================================
// PROFILE PAGE
// ============================================

function initProfilePage() {
    console.log('Profile page initialized');
    
    const user = Utils.getUserSession();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // State management
    let currentStep = 1;
    let profilePhotos = [];
    let galleryPhotos = [];
    let selectedInterests = [];
    let videoFile = null;
    let profileData = {
        basic: {},
        contact: {},
        about: {},
        preferences: {},
        media: {},
        verification: {}
    };
    
    // DOM Elements
    const stepCards = {
        1: document.getElementById('step1Card'),
        2: document.getElementById('step2Card'),
        3: document.getElementById('step3Card'),
        4: document.getElementById('step4Card'),
        5: document.getElementById('step5Card'),
        6: document.getElementById('step6Card')
    };
    
    const progressFill = document.getElementById('progressFill');
    const steps = {
        1: document.getElementById('step1'),
        2: document.getElementById('step2'),
        3: document.getElementById('step3'),
        4: document.getElementById('step4'),
        5: document.getElementById('step5'),
        6: document.getElementById('step6')
    };
    
    // Photo Upload Handlers
    function initPhotoUpload(boxId, inputId, index, isProfile = false) {
        const box = document.getElementById(boxId);
        const input = document.getElementById(inputId);
        
        if (!box || !input) return;
        
        box.addEventListener('click', () => input.click());
        
        input.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                if (!file.type.startsWith('image/')) {
                    alert('Please upload an image file');
                    return;
                }
                
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB');
                    return;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    box.innerHTML = `
                        <div class="photo-preview">
                            <img src="${e.target.result}" alt="Upload">
                            <button class="remove-photo" onclick="window.removePhoto('${boxId}', ${index}, ${isProfile})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                    box.classList.add('has-image');
                    
                    if (isProfile) {
                        profilePhotos[index] = file;
                        checkStep1Completion();
                    } else {
                        galleryPhotos[index] = file;
                    }
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Initialize all photo uploads
    initPhotoUpload('profilePhotoBox', 'profilePhotoInput', 0, true);
    initPhotoUpload('photoBox2', 'photoInput2', 1, true);
    initPhotoUpload('photoBox3', 'photoInput3', 2, true);
    
    for (let i = 1; i <= 6; i++) {
        initPhotoUpload(`galleryPhoto${i}`, `galleryInput${i}`, i-1, false);
    }
    
    // Video upload
    const videoBox = document.getElementById('videoUploadBox');
    const videoInput = document.getElementById('videoInput');
    
    if (videoBox && videoInput) {
        videoBox.addEventListener('click', () => videoInput.click());
        
        videoInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                if (!file.type.startsWith('video/')) {
                    alert('Please upload a video file');
                    return;
                }
                
                if (file.size > 50 * 1024 * 1024) {
                    alert('File size must be less than 50MB');
                    return;
                }
                
                videoFile = file;
                videoBox.innerHTML = `
                    <div class="photo-preview" style="aspect-ratio: 16/9;">
                        <video src="${URL.createObjectURL(file)}" style="width: 100%; height: 100%; object-fit: cover;"></video>
                        <button class="remove-photo" onclick="window.removeVideo()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            }
        });
    }
    
    // Remove photo function
    window.removePhoto = function(boxId, index, isProfile) {
        const box = document.getElementById(boxId);
        box.innerHTML = `
            <i class="fas fa-camera"></i>
            <span>Add Photo</span>
            <input type="file" accept="image/*" id="${box.querySelector('input')?.id || 'photoInput'}" style="display: none;">
        `;
        box.classList.remove('has-image');
        
        if (isProfile) {
            profilePhotos[index] = null;
            checkStep1Completion();
        } else {
            galleryPhotos[index] = null;
        }
    };
    
    // Remove video function
    window.removeVideo = function() {
        videoFile = null;
        videoBox.innerHTML = `
            <i class="fas fa-video"></i>
            <span>Upload Video</span>
            <input type="file" accept="video/*" id="videoInput" style="display: none;">
        `;
    };
    
    // Check Step 1 completion
    function checkStep1Completion() {
        const hasProfilePhoto = profilePhotos[0] !== null;
        const hasTwoPhotos = profilePhotos.filter(p => p !== null).length >= 2;
        const displayName = document.getElementById('displayName')?.value;
        const firstName = document.getElementById('firstName')?.value;
        const lastName = document.getElementById('lastName')?.value;
        const dob = document.getElementById('dob')?.value;
        const gender = document.getElementById('gender')?.value;
        
        const isComplete = hasProfilePhoto && hasTwoPhotos && displayName && firstName && lastName && dob && gender;
        
        const nextBtn = document.getElementById('nextToContact');
        if (nextBtn) {
            nextBtn.disabled = !isComplete;
        }
        
        if (isComplete) {
            document.getElementById('completionBadge1').style.display = 'flex';
        }
        
        return isComplete;
    }
    
    // Real-time validation for Step 1
    document.getElementById('displayName')?.addEventListener('input', checkStep1Completion);
    document.getElementById('firstName')?.addEventListener('input', checkStep1Completion);
    document.getElementById('lastName')?.addEventListener('input', checkStep1Completion);
    document.getElementById('dob')?.addEventListener('change', checkStep1Completion);
    document.getElementById('gender')?.addEventListener('change', checkStep1Completion);
    
    // Navigation functions
    function goToStep(step) {
        currentStep = step;
        
        // Hide all cards
        Object.values(stepCards).forEach(card => {
            if (card) card.style.display = 'none';
        });
        
        // Show current card
        if (stepCards[step]) {
            stepCards[step].style.display = 'block';
        }
        
        // Update progress bar
        if (progressFill) {
            progressFill.style.width = `${(step / 6) * 100}%`;
        }
        
        // Update step indicators
        Object.entries(steps).forEach(([key, el]) => {
            if (el) {
                const stepNum = parseInt(key);
                if (stepNum < step) {
                    el.className = 'step completed';
                } else if (stepNum === step) {
                    el.className = 'step active';
                } else {
                    el.className = 'step';
                }
            }
        });
        
        // Update profile strength if on step 6
        if (step === 6) {
            updateProfileStrength();
        }
    }
    
    // Navigation buttons
    document.getElementById('nextToContact')?.addEventListener('click', () => {
        if (checkStep1Completion()) {
            goToStep(2);
        } else {
            alert('Please complete all required fields in this section');
        }
    });
    
    document.getElementById('nextToAbout')?.addEventListener('click', () => {
        const email = document.getElementById('contactEmail')?.value;
        
        if (!email || !Utils.isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        document.getElementById('completionBadge2').style.display = 'flex';
        document.getElementById('userEmail').textContent = email;
        goToStep(3);
    });
    
    document.getElementById('nextToPreferences')?.addEventListener('click', () => {
        const bio = document.getElementById('bio')?.value;
        const country = document.getElementById('country')?.value;
        const city = document.getElementById('city')?.value;
        
        if (!bio || bio.length < 20) {
            alert('Please write a bio with at least 20 characters');
            return;
        }
        
        if (selectedInterests.length < 5) {
            alert('Please select at least 5 interests');
            return;
        }
        
        if (!country || !city) {
            alert('Please enter your location');
            return;
        }
        
        document.getElementById('completionBadge3').style.display = 'flex';
        goToStep(4);
    });
    
    document.getElementById('nextToMedia')?.addEventListener('click', () => {
        const ageMin = document.getElementById('ageMin')?.value;
        const ageMax = document.getElementById('ageMax')?.value;
        
        if (!ageMin || !ageMax) {
            alert('Please set your age preferences');
            return;
        }
        
        if (parseInt(ageMin) > parseInt(ageMax)) {
            alert('Minimum age cannot be greater than maximum age');
            return;
        }
        
        document.getElementById('completionBadge4').style.display = 'flex';
        goToStep(5);
    });
    
    document.getElementById('nextToVerification')?.addEventListener('click', () => {
        document.getElementById('completionBadge5').style.display = 'flex';
        goToStep(6);
    });
    
    // Back buttons
    document.getElementById('backToBasic')?.addEventListener('click', () => goToStep(1));
    document.getElementById('backToContact')?.addEventListener('click', () => goToStep(2));
    document.getElementById('backToAbout')?.addEventListener('click', () => goToStep(3));
    document.getElementById('backToPreferences')?.addEventListener('click', () => goToStep(4));
    document.getElementById('backToMedia')?.addEventListener('click', () => goToStep(5));
    
    // Skip to home
    document.getElementById('skipToHome')?.addEventListener('click', () => {
        if (confirm('You can complete your profile later. Are you sure you want to skip?')) {
            window.location.href = 'home.html';
        }
    });
    
    // Interest selection
    const interestTags = document.querySelectorAll('.interest-tag');
    const interestsAlert = document.getElementById('interestsAlert');
    
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
            
            const remaining = 5 - selectedInterests.length;
            if (remaining > 0 && interestsAlert) {
                interestsAlert.className = 'alert alert-info';
                interestsAlert.innerHTML = `<i class="fas fa-info-circle"></i> Select ${remaining} more interest${remaining > 1 ? 's' : ''}`;
                interestsAlert.style.display = 'flex';
            } else if (interestsAlert) {
                interestsAlert.style.display = 'none';
            }
        });
    });
    
    // Location detection
    document.getElementById('detectLocation')?.addEventListener('click', function() {
        if (navigator.geolocation) {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    document.getElementById('city').value = 'New York';
                    document.getElementById('country').value = 'USA';
                    this.innerHTML = '<i class="fas fa-crosshairs"></i>';
                },
                (error) => {
                    alert('Could not detect location. Please enter manually.');
                    this.innerHTML = '<i class="fas fa-crosshairs"></i>';
                }
            );
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
    
    // Toggle switches
    document.querySelectorAll('.toggle-switch').forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // Verification buttons
    document.getElementById('verifyEmailBtn')?.addEventListener('click', function() {
        Utils.showAlert('verificationAlert', 'Verification email sent! Please check your inbox.', 'success');
        
        document.getElementById('emailStatus').className = 'verification-status pending';
        document.getElementById('emailStatus').textContent = 'Pending';
    });
    
    document.getElementById('verifyPhoneBtn')?.addEventListener('click', function() {
        alert('Phone verification would be implemented here');
    });
    
    document.getElementById('verifyIdentityBtn')?.addEventListener('click', function() {
        alert('Identity verification would be implemented here');
    });
    
    // Update profile strength
    function updateProfileStrength() {
        const badges = [
            '✅ Basic Info Completed',
            '✅ Contact Info Added',
            '✅ Bio & Interests Added',
            '✅ Preferences Set',
            '✅ Photos Added',
            '📧 Email Verification',
            '📱 Phone Verification',
            '🆔 Identity Verification'
        ];
        
        const completedCount = 5; // First 5 steps completed
        const strength = Math.round((completedCount / 8) * 100);
        
        document.getElementById('profileStrength').textContent = `${strength}%`;
        document.getElementById('profileStrengthBar').style.width = `${strength}%`;
        
        const badgesContainer = document.getElementById('completionBadges');
        badgesContainer.innerHTML = badges.map((badge, i) => `
            <div class="badge ${i < 5 ? 'verified' : ''}">
                <i class="fas ${i < 5 ? 'fa-check-circle' : 'fa-hourglass-half'}"></i>
                <span>${badge}</span>
            </div>
        `).join('');
        
        const completeBtn = document.getElementById('completeProfile');
        if (completeBtn) {
            completeBtn.disabled = false;
        }
    }
    
    // Complete profile
    document.getElementById('completeProfile')?.addEventListener('click', async function() {
        this.disabled = true;
        this.innerHTML = '<span class="spinner" style="display: inline-block;"></span> Finalizing...';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            Utils.updateUserSession({ hasProfile: true });
            
            alert('Profile completed successfully! Welcome to Matchly!');
            window.location.href = 'home.html';
        } catch (error) {
            alert('Failed to complete profile. Please try again.');
            this.disabled = false;
            this.innerHTML = 'Complete Profile';
        }
    });
    
    // Pre-fill user email
    if (user && user.email) {
        const emailField = document.getElementById('contactEmail');
        if (emailField) {
            emailField.value = user.email;
        }
    }
}

// ============================================
// COMMON FUNCTIONS
// ============================================

function initCommon() {
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
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (alertId) {
            Utils.showAlert(alertId, `${provider} login successful! Redirecting...`, 'success');
        }
        
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