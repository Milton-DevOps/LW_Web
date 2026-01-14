"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "../../../components/Button";
import { colors } from "../../../constants/colors";
import styles from '../utilities.module.css';

export default function OTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0 && !verified) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, verified]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      setVerified(true);
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimeLeft(120);
    inputRefs.current[0]?.focus();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.bgSurface}`}>
      <div className={`w-full max-w-sm bg-white border rounded-lg shadow-md p-8 ${styles.bgBorder}`}>
        <h2 className={`text-center text-xl font-bold mb-2 ${styles.textDarkColor}`}>VERIFY OTP</h2>
        <p className={`text-center text-sm mb-6 ${styles.textSecondaryColor}`}>
          We&apos;ve sent a one-time password to your email
        </p>

        {!verified ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none transition-colors ${styles.otpInput}`}
                  style={{
                    borderColor: digit ? colors.light.primary : colors.light.border,
                    color: colors.light.text,
                  }}
                  title="OTP digit input"
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm" style={{ color: colors.light.textSecondary }}>
                  Code expires in <span style={{ color: colors.light.primary, fontWeight: "bold" }}>{formatTime(timeLeft)}</span>
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
              VERIFY OTP
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
        ) : (
          <div className="text-center space-y-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: colors.light.primary }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg" style={{ color: colors.light.text }}>Verified Successfully!</h3>
            <p className="text-sm" style={{ color: colors.light.textSecondary }}>
              Your email has been verified. You can now proceed to login.
            </p>
            <Link href="/auth/login" className="block mt-4">
              <Button fullWidth>CONTINUE TO LOGIN</Button>
            </Link>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-sm hover:underline" style={{ color: colors.light.primary }}>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
