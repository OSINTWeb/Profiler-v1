"use client";
import { useUser } from "@auth0/nextjs-auth0";

export default function Profile() {
  const { user, isLoading, error } = useUser();
  console.log(user);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="font-bold text-lg mb-2">Error</h2>
          <p>Failed to load profile: {error.message}</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <h2 className="font-bold text-lg mb-2">Not Logged In</h2>
          <p>Please log in to view your profile.</p>
          <a 
            href="/auth/login" 
            className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Profile</h1>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
          <div className="flex items-center space-x-6">
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name || "Profile"}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
            )}
            <div className="text-white">
              <h2 className="text-2xl font-bold">
                {user.name || user.nickname || "User"}
              </h2>
              <p className="text-blue-100 text-lg">
                {user.email || "No email provided"}
              </p>
              {user.email_verified && (
                <div className="flex items-center mt-2">
                  <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-300 text-sm">Email Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 border-b pb-2">Personal Details</h4>
              
              <div className="space-y-3">
                {user.given_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">First Name</label>
                    <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded">{user.given_name}</p>
                  </div>
                )}
                
                {user.family_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Last Name</label>
                    <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded">{user.family_name}</p>
                  </div>
                )}
                
                {user.nickname && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Nickname</label>
                    <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded">{user.nickname}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 border-b pb-2">Account Details</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded">
                    {user.name || "Not provided"}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded">
                    {user.email || "Not provided"}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email Status</label>
                  <p className={`px-3 py-2 rounded ${
                    user.email_verified 
                      ? 'text-green-800 bg-green-50' 
                      : 'text-red-800 bg-red-50'
                  }`}>
                    {user.email_verified ? "Verified" : "Not Verified"}
                  </p>
                </div>

                {user.sub && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">User ID</label>
                    <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded text-sm font-mono">
                      {user.sub}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              <a
                href="/dashboard"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Go to Dashboard
              </a>
              <a
                href="/auth/logout"
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Information (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Information (Development Only)</h3>
          <pre className="text-xs bg-white p-3 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
