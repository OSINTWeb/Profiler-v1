"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { User, Mail, Shield, Calendar, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function Profile() {
  const { user, isLoading, error } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-zinc-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-white/70 text-lg font-light">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900/80 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Access Error</h2>
          <p className="text-red-400 mb-6">Failed to load profile: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-zinc-200 transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-white/70" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-white/60 mb-6">Please log in to access your profile.</p>
          <a 
            href="/api/auth/login" 
            className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-xl hover:bg-zinc-200 transition-all duration-200"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
          <p className="text-white/60 text-lg">Manage your account settings and preferences</p>
        </div>

        {/* Main Profile Card */}
        <div className="relative mb-8">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-zinc-300/20 rounded-3xl blur-lg opacity-30"></div>
          
          <div className="relative bg-zinc-900/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            {/* Profile Header */}
            <div className="relative bg-gradient-to-r from-black via-zinc-900 to-black p-8 border-b border-white/10">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile Picture */}
                <div className="relative group">
                  {user.picture ? (
                    <div className="relative">
                      <div className="absolute -inset-1 bg-white/20 rounded-full blur"></div>
                      <img
                        src={user.picture}
                        alt={user.name || "Profile"}
                        className="relative w-32 h-32 rounded-full border-4 border-white/20 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-white/10 rounded-full border-4 border-white/20 flex items-center justify-center">
                      <User size={48} className="text-white/50" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {user.name || user.nickname || "User"}
                  </h2>
                  <p className="text-white/70 text-xl mb-4 flex items-center justify-center md:justify-start gap-2">
                    <Mail size={20} />
                    {user.email || "No email provided"}
                  </p>
                  
                  {/* Verification Badge */}
                  {user.email_verified && (
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                      <Shield size={16} className="text-white" />
                      <span className="text-white text-sm font-medium">Verified Account</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <User size={24} />
                    Personal Information
                  </h3>
                  
                  <div className="space-y-4">
                    {user.given_name && (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <label className="block text-white/50 text-sm font-medium mb-2">First Name</label>
                        <p className="text-white text-lg font-medium">{user.given_name}</p>
                      </div>
                    )}
                    
                    {user.family_name && (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <label className="block text-white/50 text-sm font-medium mb-2">Last Name</label>
                        <p className="text-white text-lg font-medium">{user.family_name}</p>
                      </div>
                    )}
                    
                    {user.nickname && (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <label className="block text-white/50 text-sm font-medium mb-2">Nickname</label>
                        <p className="text-white text-lg font-medium">{user.nickname}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Settings size={24} />
                    Account Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <label className="block text-white/50 text-sm font-medium mb-2">Full Name</label>
                      <p className="text-white text-lg font-medium">
                        {user.name || "Not provided"}
                      </p>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <label className="block text-white/50 text-sm font-medium mb-2">Email Address</label>
                      <p className="text-white text-lg font-medium">
                        {user.email || "Not provided"}
                      </p>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <label className="block text-white/50 text-sm font-medium mb-2">Email Status</label>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        user.email_verified 
                          ? 'bg-white/20 text-white' 
                          : 'bg-zinc-700/50 text-zinc-300'
                      }`}>
                        <Shield size={14} />
                        {user.email_verified ? "Verified" : "Not Verified"}
                      </div>
                    </div>

                    {user.sub && (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <label className="block text-white/50 text-sm font-medium mb-2">User ID</label>
                        <p className="text-white/70 text-sm font-mono break-all">
                          {user.sub}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="group relative bg-white text-black font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 text-center"
          >
            <span className="flex items-center justify-center gap-2">
              <Calendar size={20} />
              Go to Dashboard
            </span>
          </Link>
          <a
            href="/api/auth/logout"
            className="group relative bg-zinc-900/80 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-zinc-800/80 text-center"
          >
            <span className="flex items-center justify-center gap-2">
              <LogOut size={20} />
              Logout
            </span>
          </a>
        </div>

        {/* Debug Information (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-12 bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Settings size={20} />
              Debug Information (Development Only)
            </h3>
            <div className="bg-black/50 rounded-xl p-4 overflow-auto">
              <pre className="text-zinc-300 text-xs">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
