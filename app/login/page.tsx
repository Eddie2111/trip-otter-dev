import { LoginPage } from "@/components/login-page"
import { Metadata } from "next";
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: "Login",
      default: "Login",
    },
    description: "Log in to TripOtter",
  };
}

export default function Login() {
  return <LoginPage />
}
