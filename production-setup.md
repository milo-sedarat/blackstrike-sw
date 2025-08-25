=== BLACKSTRIKE PRODUCTION SETUP GUIDE ===

## 1. Add Environment Variables to Vercel
Go to: https://vercel.com/dashboard
Select your BlackStrike project
Settings → Environment Variables
Add these variables:
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDJSJ9h-ZZObqDpAPPqQp7sPQn1RAbzzyE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=blackstrike-sw.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=blackstrike-sw
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=blackstrike-sw.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=955098067128
NEXT_PUBLIC_FIREBASE_APP_ID=1:955098067128:web:6d01c16579a0c27a61c44d

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=BlackStrike

## 2. Add Domain to Firebase Auth
Go to: https://console.firebase.google.com/project/blackstrike-sw/authentication/settings
Add 'app.blackstrike.ai' to Authorized domains

## 3. Test Authentication
Visit: https://app.blackstrike.ai/auth/login
Test signup: https://app.blackstrike.ai/auth/signup
