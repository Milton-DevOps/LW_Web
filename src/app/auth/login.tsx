"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { colors } from "../../constants/colors";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(false);

	return (
		<div className="min-h-screen flex items-center justify-center" style={{ background: colors.light.surface }}>
			<div className="w-full max-w-sm bg-white border rounded-lg shadow-md p-8" style={{ borderColor: colors.light.border }}>
				<h2 className="text-center text-xl font-bold mb-6" style={{ color: colors.light.text }}>LOGIN</h2>

				<form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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

					<div className="flex items-center justify-between mt-1">
						<label className="inline-flex items-center text-sm text-gray-600">
							<input
								type="checkbox"
								checked={remember}
								onChange={(e) => setRemember(e.target.checked)}
								className="mr-2"
							/>
							Remember me
						</label>
						<Link href="#" className="text-sm text-gray-600 hover:underline">
							Forgot password?
						</Link>
					</div>

					<Button type="submit" fullWidth className="mt-3">LOGIN</Button>
				</form>

				<div className="mt-4 text-center text-sm text-gray-600">Or login with</div>

				<div className="mt-3 flex gap-3 justify-center">
					<button className="px-4 py-2 border rounded flex items-center gap-2" style={{ borderColor: colors.light.border }}>
						<span>Facebook</span>
					</button>
					<button className="px-4 py-2 border rounded flex items-center gap-2" style={{ borderColor: colors.light.border }}>
						<span>Google</span>
					</button>
				</div>

				<p className="mt-6 text-center text-sm text-gray-500">Don&apos;t have an account? <Link href="/auth/register" className="text-primary font-medium">Register</Link></p>
			</div>
		</div>
	);
}
