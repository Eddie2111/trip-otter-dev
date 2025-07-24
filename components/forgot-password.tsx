"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Camera } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useResetPasswordAPI } from "@/lib/requests";

// Define Zod schema for email input
const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export function ForgotPasswordPage() {
  const [currentStep, setCurrentStep] = useState(1); // 1 for email, 2 for verification message
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleEmailSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    console.log("Email submitted:", data.email);
    setUserEmail(data.email);
    // Simulate API call to send verification email
    const response = await useResetPasswordAPI.createEmail({
      email: data.email,
      reason: "PASSWORD_RESET",
    });
    if (response.status===200) {
      toast.success(`Verification email sent to ${data.email}`);
      setCurrentStep(2);
      setIsLoading(false);
    } else {
      toast.error("Failed to send verification email, try again?");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tripotter
            </CardTitle>
          </div>
          <p className="text-gray-600">
            {currentStep === 1
              ? "Enter your email to reset your password"
              : `Verification email sent to ${userEmail}`}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          )}

          {currentStep === 2 && (
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-700">
                We've sent a verification email to **{userEmail}**. Please check
                your inbox (and spam folder) to proceed with resetting your
                password.
              </p>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/login"
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
