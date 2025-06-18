import { auth0 } from "@/lib/auth0";
import Link from "next/link";

export default async function Navigation() {
  const session = await auth0.getSession();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          My App
        </Link>
        
        <div className="space-x-4">
          {session ? (
            <>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/profile" className="hover:underline">
                Profile
              </Link>
              <span>Welcome, {session.user.name}!</span>
              <a 
                href="/auth/logout"
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </a>
            </>
          ) : (
            <>
              <a 
                href="/auth/login"
                className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
              >
                Login
              </a>
              <a 
                href="/auth/login?screen_hint=signup"
                className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}