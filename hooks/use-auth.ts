import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  updatePassword,
  updateEmail,
  sendEmailVerification,
  unlink,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified
      if (!result.user.emailVerified) {
        await signOut(auth);
        return { success: false, error: new Error('Please verify your email before signing in. Check your inbox for a verification link.') };
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with first and last name
      await updateProfile(result.user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Send email verification
      await sendEmailVerification(result.user);
      
      // Sign out the user immediately after signup
      await signOut(auth);
      
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error };
    }
  };

  const changeEmail = async (newEmail: string, password: string) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      if (user.providerData.some(provider => provider.providerId === 'google.com')) {
        throw new Error('Cannot change email for Google accounts. Please detach from Google first.');
      }

      // Re-authenticate user before changing email
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
      
      // Update email
      await updateEmail(user, newEmail);
      
      // Send email verification for new email
      await sendEmailVerification(user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      if (user.providerData.some(provider => provider.providerId === 'google.com')) {
        throw new Error('Cannot change password for Google accounts. Please detach from Google first.');
      }

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const detachGoogleAccount = async (newEmail: string, newPassword: string) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      // Check if user is actually a Google user
      const isGoogleUser = user.providerData.some(provider => provider.providerId === 'google.com');
      if (!isGoogleUser) {
        throw new Error('User is not connected to Google');
      }

      // Update email first
      await updateEmail(user, newEmail);
      
      // Update password
      await updatePassword(user, newPassword);
      
      // Unlink Google provider
      await unlink(user, 'google.com');
      
      // Send email verification
      await sendEmailVerification(user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
    signInWithGoogle,
    changeEmail,
    changePassword,
    detachGoogleAccount,
  };
} 