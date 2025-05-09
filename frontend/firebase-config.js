// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
    authDomain: "hostel-management-system.firebaseapp.com",
    projectId: "hostel-management-system",
    storageBucket: "hostel-management-system.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = firebase.auth();

// Initialize Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Initialize Apple Auth Provider
const appleProvider = new firebase.auth.OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

// Export auth functions
const authFunctions = {
    // Email/Password Authentication
    signInWithEmail: async (email, password) => {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    },

    // Google Authentication
    signInWithGoogle: async () => {
        try {
            const result = await auth.signInWithPopup(googleProvider);
            return result.user;
        } catch (error) {
            throw error;
        }
    },

    // Apple Authentication
    signInWithApple: async () => {
        try {
            const result = await auth.signInWithPopup(appleProvider);
            return result.user;
        } catch (error) {
            throw error;
        }
    },

    // Password Reset
    sendPasswordResetEmail: async (email) => {
        try {
            await auth.sendPasswordResetEmail(email);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Sign Out
    signOut: async () => {
        try {
            await auth.signOut();
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Set Persistence
    setPersistence: (rememberMe) => {
        const persistence = rememberMe 
            ? firebase.auth.Auth.Persistence.LOCAL 
            : firebase.auth.Auth.Persistence.SESSION;
        return auth.setPersistence(persistence);
    },

    // Get Current User
    getCurrentUser: () => {
        return auth.currentUser;
    },

    // Auth State Change Listener
    onAuthStateChanged: (callback) => {
        return auth.onAuthStateChanged(callback);
    }
};

// Export the auth functions
window.authFunctions = authFunctions; 