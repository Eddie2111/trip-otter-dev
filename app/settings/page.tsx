"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Account Settings</h3>
              <p className="text-gray-600">
                Manage your account preferences and privacy settings.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Notifications</h3>
              <p className="text-gray-600">
                Control how you receive notifications.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Privacy</h3>
              <p className="text-gray-600">
                Manage your privacy and data settings.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Theme</h3>
              <p className="text-gray-600">Customize your app appearance.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-2xl">Others</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            <Link href="/settings/analytics">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Analytics</h3>
                <p className="text-gray-600">Check the platforms analytics</p>
              </div>
            </Link>

            <Link href="/settings/reviews">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Reviews and Issues</h3>
                <p className="text-gray-600">
                  Check what users are saying and updates of the created issues.
                </p>
              </div>
            </Link>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
