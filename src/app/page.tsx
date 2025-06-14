import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome to My App</h1>
        <div className="space-x-4">
          <a 
            href="/auth/login?screen_hint=signup"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >  
            Sign up
          </a>
          <a 
            href="/auth/login"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Log in
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {session.user.name}!</h1>
      <div className=" p-4 rounded">
        <p><strong>Name:</strong> {session.user.name}</p>
        <p><strong>Email:</strong> {session.user.email}</p>
        {session.user.picture && (
          <img 
            src={session.user.picture} 
            alt="Profile" 
            className="w-20 h-20 rounded-full mt-4"
          />
        )}
      </div>
      <div className="mt-4">
        <a 
          href="/auth/logout"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </a>
      </div>
    </main>
  );
}