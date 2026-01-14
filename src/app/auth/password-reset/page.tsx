"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { colors } from "../../../constants/colors";

export default function PasswordReset() {
  const [stage, setStage] = useState<"email" | "otp" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0 && stage === "otp") {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, stage]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setStage("otp");
      inputRefs.current[0]?.focus();
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

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      setStage("success");
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimeLeft(120);
    inputRefs.current[0]?.focus();
  };

  const handleBackToEmail = () => {
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setTimeLeft(120);
    setStage("email");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: colors.light.surface }}>
      <div className="w-full max-w-sm bg-white border rounded-lg shadow-md p-8" style={{ borderColor: colors.light.border }}>
        {stage === "email" && (
          <>
            <h2 className="text-center text-xl font-bold mb-2" style={{ color: colors.light.text }}>
              RESET PASSWORD
            </h2>
            <p className="text-center text-sm mb-6" style={{ color: colors.light.textSecondary }}>
              Enter your email address and we&apos;ll send you a code
            </p>

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

              <Button type="submit" fullWidth className="mt-3">
                SEND CODE
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-sm hover:underline" style={{ color: colors.light.primary }}>
                Back to login
              </Link>
            </div>
          </>
        )}

        {stage === "otp" && (
          <>
            <h2 className="text-center text-xl font-bold mb-2" style={{ color: colors.light.text }}>
              VERIFY CODE
            </h2>
            <p className="text-center text-sm mb-6" style={{ color: colors.light.textSecondary }}>
              We&apos;ve sent a code to <strong>{email}</strong>
            </p>

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
                      borderColor: digit ? colors.light.primary : colors.light.border,
                      color: colors.light.text,
                    }}
                    placeholder="-"
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="text-center">
                {timeLeft > 0 ? (
                  <p className="text-sm" style={{ color: colors.light.textSecondary }}>
                    Code expires in{" "}
                    <span style={{ color: colors.light.primary, fontWeight: "bold" }}>
                      {formatTime(timeLeft)}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm" style={{ color: colors.light.primary }}>
                    Code expired. Please request a new one.
                  </p>
                )}
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                fullWidth
                disabled={otp.join("").length !== 6}
                className={otp.join("").length !== 6 ? "opacity-50 cursor-not-allowed" : ""}
              >
                VERIFY CODE
              </Button>

              {/* Resend Section */}
              <div className="text-center">
                <p className="text-sm" style={{ color: colors.light.textSecondary }}>
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={timeLeft > 0}
                    className={`font-medium ${timeLeft > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={{ color: colors.light.primary }}
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
                style={{ color: colors.light.primary }}
              >
                Use different email
              </button>
            </div>
          </>
        )}

        {stage === "success" && (
          <>
            <div className="text-center space-y-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: colors.light.primary }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg" style={{ color: colors.light.text }}>
                Code Verified!
              </h3>
              <p className="text-sm" style={{ color: colors.light.textSecondary }}>
                You can now set a new password for your account.
              </p>
              <Link href="/auth/set-new-password" className="block mt-4">
                <Button fullWidth>SET NEW PASSWORD</Button>
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-sm hover:underline" style={{ color: colors.light.primary }}>
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
