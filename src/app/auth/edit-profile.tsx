"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { colors } from "../../constants/colors";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    firstName: "Robert",
    lastName: "William",
    email: "robert.william@example.com",
    phone: "+1 234 567 8900",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    bio: "Full-stack developer with passion for creating beautiful web applications",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8" style={{ background: colors.light.surface }}>
      <div className="w-full max-w-2xl bg-white border rounded-lg shadow-md p-8" style={{ borderColor: colors.light.border }}>
        <h2 className="text-center text-xl font-bold mb-8" style={{ color: colors.light.text }}>EDIT PROFILE</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4"
              style={{ backgroundColor: colors.light.primary }}
            >
              RW
            </div>
            <Button type="button" variant="secondary" size="sm">
              CHANGE PHOTO
            </Button>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: colors.light.text }}>Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
              />
              <Input
                label="Last Name"
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: colors.light.text }}>Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="your@example.com"
                value={formData.email}
                onChange={handleChange}
                fullWidth
              />
              <Input
                label="Phone"
                type="tel"
                name="phone"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: colors.light.text }}>Address</h3>
            <div className="mb-4">
              <Input
                label="Street Address"
                type="text"
                name="address"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={handleChange}
                fullWidth
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                fullWidth
              />
              <Input
                label="State"
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                fullWidth
              />
              <Input
                label="Zip Code"
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: colors.light.text }}>Bio</h3>
            <textarea
              name="bio"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-base border-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none transition-colors duration-200"
              style={{ borderColor: colors.light.border, "--focus-border-color": colors.light.primary } as React.CSSProperties & { "--focus-border-color": string }}
              rows={4}
            />
          </div>

          {/* Success Message */}
          {saved && (
            <div
              className="p-4 rounded-lg text-white text-sm font-medium text-center"
              style={{ backgroundColor: colors.light.primary }}
            >
              ✓ Profile updated successfully!
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" fullWidth>
              SAVE CHANGES
            </Button>
            <Link href="/auth/login" className="w-full">
              <Button type="button" variant="secondary" fullWidth>
                CANCEL
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
