import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold text-gray-900">
            Welcome to Pet Management App
          </h1>
          <p className="text-xl text-gray-600">
            Manage your beloved pets with ease. Track their information, photos, and more!
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" variant="default">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline">
                Sign Up
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card>
              <CardHeader>
                <CardTitle>Easy Management</CardTitle>
                <CardDescription>
                  Keep all your pet information in one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Add, edit, and manage your pets&apos; profiles with photos and details.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photo Storage</CardTitle>
                <CardDescription>
                  Store your favorite pet photos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Upload and store photos of your pets securely in the cloud.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Track Details</CardTitle>
                <CardDescription>
                  Remember important information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Keep track of breed, birthday, gender, and other important details.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
