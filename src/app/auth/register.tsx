"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { colors } from "../../constants/colors";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: colors.light.surface }}>
      <div className="w-full max-w-sm bg-white border rounded-lg shadow-md p-8" style={{ borderColor: colors.light.border }}>
        <h2 className="text-center text-xl font-bold mb-6" style={{ color: colors.light.text }}>REGISTER</h2>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input
            label="Full name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            fullWidth
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            fullWidth
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            fullWidth
          />

          <Input
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
            fullWidth
          />

          <Button type="submit" fullWidth className="mt-3">REGISTER</Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">Already have an account? <Link href="/auth/login" className="text-primary font-medium">Login</Link></p>
      </div>
    </div>
  );
}
