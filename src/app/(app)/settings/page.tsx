"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Building2, Bell, Check } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (session?.user) {
      const parts = (session.user.name || "").split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handleSave = async () => {
    if (!session?.user?.id) return;
    setSaving(true);
    setSuccessMessage("");
    try {
      const res = await fetch(`/api/users/${session.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
        }),
      });
      if (res.ok) {
        setSuccessMessage("Settings saved successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setSuccessMessage("Failed to save settings. Please try again.");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch {
      setSuccessMessage("Failed to save settings. Please try again.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and workspace preferences</p>
      </div>

      {successMessage && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${successMessage.includes("success") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {successMessage.includes("success") && <Check className="w-4 h-4" />}
          {successMessage}
        </div>
      )}

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4" />Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input value={email} className="mt-1" disabled />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <Input value={session?.user?.role || ""} className="mt-1" disabled />
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Building2 className="w-4 h-4" />Workspace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Workspace Name</label>
            <Input defaultValue="OpenHorn Staffing" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Default Pipeline Stages</label>
            <p className="text-sm text-gray-500 mt-1">New Lead → Screening → Submitted → Interview → Offer → Placed</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4" />Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Notification preferences coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
