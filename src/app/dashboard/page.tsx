import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <main className="bg-black ">
      {" "}
      <h1 className="text-3xl font-bold mb-8 text-black">Dashboard</h1>
      <div className="bg-green-100 p-4 rounded">
        <p className="text-black">Welcome to your protected dashboard, {session.user.name}!</p>
        <p>Email: {session.user.email}</p>
      </div>
      <div className="mt-4">
        <a href="/auth/logout" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </a>
      </div>
    </main>
  );
}
