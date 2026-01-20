"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { colors } from "../../../constants/colors";
import { requestPasswordReset, verifyOTP, resetPassword } from "../../../services/authService";

export default function PasswordReset() {
  const router = useRouter();
  const [stage, setStage] = useState<"email" | "otp" | "newPassword" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0 && stage === "otp") {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, stage]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    if (!email.trim()) {
      setFormError("Please enter your email");
      setLoading(false);
      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setFormError("Please enter a valid email");
      setLoading(false);
      return;
    }

    try {
      const response = await requestPasswordReset(email);
      if (response.success) {
        setStage("otp");
        setTimeLeft(120);
        inputRefs.current[0]?.focus();
      } else {
        setFormError(response.message || "Failed to send code");
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    try {
      const otpValue = otp.join("");
      if (otpValue.length !== 6) {
        setFormError("Please enter a valid 6-digit code");
        setLoading(false);
        return;
      }

      const response = await verifyOTP(email, otpValue);
      if (response.success) {
        setStage("newPassword");
      } else {
        setFormError(response.message || "Invalid OTP");
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setFormError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword(email, newPassword, confirmPassword);
      if (response.success) {
        setStage("success");
        // Redirect after 2 seconds with page refresh
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setFormError("");
    setLoading(true);
    try {
      const response = await requestPasswordReset(email);
      if (response.success) {
        setOtp(["", "", "", "", "", ""]);
        setTimeLeft(120);
        inputRefs.current[0]?.focus();
      } else {
        setFormError(response.message || "Failed to resend code");
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setTimeLeft(120);
    setFormError("");
    setStage("email");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: colors.surface }}>
      <div className="w-full max-w-sm bg-white border rounded-lg shadow-md p-8" style={{ borderColor: colors.border }}>
        {stage === "email" && (
          <>
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center text-[#cb4154] hover:text-[#a83444] transition-colors"
            >
              <span className="mr-2">←</span> Back
            </button>
            <h2 className="text-center text-xl font-bold mb-2" style={{ color: colors.text }}>
              RESET PASSWORD
            </h2>
            <p className="text-center text-sm mb-6" style={{ color: colors.textSecondary }}>
              Enter your email address and we&apos;ll send you a code
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm" role="alert">
                {formError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleEmailSubmit}>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                fullWidth
                required
              />

              <Button type="submit" fullWidth variant="primary" className="mt-3" disabled={loading}>
                {loading ? "SENDING..." : "SEND CODE"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-sm hover:underline" style={{ color: colors.primary }}>
                Back to login
              </Link>
            </div>
          </>
        )}

        {stage === "otp" && (
          <>
            <h2 className="text-center text-xl font-bold mb-2" style={{ color: colors.text }}>
              VERIFY CODE
            </h2>
            <p className="text-center text-sm mb-6" style={{ color: colors.textSecondary }}>
              We&apos;ve sent a code to <strong>{email}</strong>
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm" role="alert">
                {formError}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleOtpSubmit}>
              {/* OTP Input Fields */}
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none transition-colors"
                    style={{
                      borderColor: digit ? colors.primary : colors.border,
                      color: colors.text,
                    }}
                    placeholder="-"
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="text-center">
                {timeLeft > 0 ? (
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Code expires in{" "}
                    <span style={{ color: colors.primary, fontWeight: "bold" }}>
                      {formatTime(timeLeft)}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm" style={{ color: colors.primary }}>
                    Code expired. Please request a new one.
                  </p>
                )}
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                fullWidth
                variant="primary"
                disabled={otp.join("").length !== 6 || loading}
                className={otp.join("").length !== 6 || loading ? "opacity-50 cursor-not-allowed" : ""}
              >
                {loading ? "VERIFYING..." : "VERIFY CODE"}
              </Button>

              {/* Resend Section */}
              <div className="text-center">
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={timeLeft > 0 || loading}
                    className={`font-medium ${timeLeft > 0 || loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={{ color: colors.primary }}
                  >
                    Resend
                  </button>
                </p>
              </div>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={handleBackToEmail}
                className="text-sm hover:underline"
                style={{ color: colors.primary }}
              >
                Use different email
              </button>
            </div>
          </>
        )}

        {stage === "newPassword" && (
          <>
            <h2 className="text-center text-xl font-bold mb-2" style={{ color: colors.text }}>
              SET NEW PASSWORD
            </h2>
            <p className="text-center text-sm mb-6" style={{ color: colors.textSecondary }}>
              Enter your new password
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm" role="alert">
                {formError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                fullWidth
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                fullWidth
                required
              />

              <Button type="submit" fullWidth variant="primary" disabled={loading}>
                {loading ? "RESETTING..." : "RESET PASSWORD"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={handleBackToEmail}
                className="text-sm hover:underline"
                style={{ color: colors.primary }}
              >
                Back to email
              </button>
            </div>
          </>
        )}

        {stage === "success" && (
          <>
            <div className="text-center space-y-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: colors.primary }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg" style={{ color: colors.text }}>
                PASSWORD RESET SUCCESSFUL
              </h3>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Your password has been reset successfully. You can now login with your new password.
              </p>
              <Button 
                onClick={() => router.push("/auth/login")} 
                fullWidth 
                variant="primary"
                className="mt-4"
              >
                GO TO LOGIN
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-sm hover:underline" style={{ color: colors.primary }}>
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

