import React, { useState } from 'react';
import { auth } from '../firebaseClient';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'; // Added sendPasswordResetEmail

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // States for password reset
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // console.log("User signed in:", userCredential.user);
      setLoading(false);
      onClose(); // Close modal on success
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        console.error("Sign in error:", err);
      }
      setLoading(false);
    }
  };

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!resetEmail) {
      setResetError("이메일을 입력해주세요.");
      return;
    }
    setLoading(true);
    setResetFeedback(null);
    setResetError(null);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetFeedback(`비밀번호 재설정 이메일이 ${resetEmail}(으)로 발송되었습니다. 받은편지함을 확인해주세요.`);
      setResetEmail(''); // Clear the input field on success
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setResetError('가입되지 않은 이메일입니다.');
      } else {
        setResetError('비밀번호 재설정 이메일 발송 중 오류가 발생했습니다.');
        console.error("Password reset error:", err);
      }
    }
    setLoading(false);
  };

  // Modified onClose to reset all states including reset form states
  const handleCloseModal = () => {
    onClose();
    setTimeout(() => {
      setEmail('');
      setPassword('');
      setError(null);
      setResetEmail('');
      setShowResetForm(false);
      setResetFeedback(null);
      setResetError(null);
      setLoading(false);
    }, 300); // Delay to allow modal close animation
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {showResetForm ? 'Reset Password' : 'Sign In'}
          </h2>
          <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700 text-2xl">
            &times;
          </button>
        </div>

        {showResetForm ? (
          <form onSubmit={handlePasswordReset}>
            <p className="mb-4 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {resetFeedback && <p className="text-green-600 text-sm mb-4 p-3 bg-green-50 rounded-lg">{resetFeedback}</p>}
            {resetError && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg">{resetError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-150 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowResetForm(false);
                setResetFeedback(null);
                setResetError(null);
                setError(null);
              }}
              disabled={loading}
              className="w-full mt-3 text-center text-blue-600 hover:underline p-2 rounded-lg disabled:opacity-50"
            >
              Back to Sign In
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleSignIn}>
              <div className="mb-4">
                <input
              type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-2">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-right mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetForm(true);
                    setError(null);
                    setResetFeedback(null);
                    setResetError(null);
                  }}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                >
                  Forgot password?
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-150 disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  if (loading) return;
                  onSwitchToSignUp();
                }}
                disabled={loading}
                className="text-blue-600 hover:underline font-semibold disabled:opacity-50"
              >
                Sign Up
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SignInModal;
