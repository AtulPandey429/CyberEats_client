const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

export function isFirebaseClientConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
}

export async function signInWithGoogleViaFirebase(): Promise<string> {
  const { initializeApp, getApps } = await import('firebase/app');
  const { getAuth, GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');

  const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  const result = await signInWithPopup(auth, provider);
  return result.user.getIdToken();
}

export function getFirebaseAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
      ? (error as { code: string }).code
      : '';

  if (code === 'auth/configuration-not-found' || code.includes('configuration')) {
    return 'Firebase Auth is not enabled yet. Open Firebase Console → Authentication → Get started → enable Google.';
  }

  if (code === 'auth/popup-closed-by-user') {
    return 'Google sign-in was cancelled.';
  }

  if (code === 'auth/unauthorized-domain') {
    return 'Add localhost to Firebase Auth authorized domains (Authentication → Settings).';
  }

  return 'Google login failed. Check Firebase Auth is enabled for this project.';
}
