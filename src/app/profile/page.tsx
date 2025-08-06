"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { User, Mail, Shield, Calendar, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function Profile() {
  const { user, isLoading, error } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-muted-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-muted-foreground rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-muted-foreground text-lg font-light">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-muted/80 backdrop-blur-sm border border-destructive/30 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Error</h2>
          <p className="text-destructive mb-6">Failed to load profile: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-foreground text-background font-semibold px-6 py-3 rounded-xl hover:bg-muted-foreground transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-muted/80 backdrop-blur-sm border border-border rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-foreground/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">Please log in to access your profile.</p>
          <a 
            href="/api/auth/login" 
            className="inline-block bg-foreground text-background font-semibold px-8 py-3 rounded-xl hover:bg-muted-foreground transition-all duration-200"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground text-lg">Manage your account settings and preferences</p>
        </div>

        {/* Main Profile Card */}
        <div className="relative mb-8">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-foreground/20 to-muted-foreground/20 rounded-3xl blur-lg opacity-30"></div>
          
          <div className="relative bg-muted/80 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
            {/* Profile Header */}
            <div className="relative bg-gradient-to-r from-background via-muted to-background p-8 border-b border-border">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile Picture */}
                <div className="relative group">
                  {user.picture ? (
                    <div className="relative">
                      <div className="absolute -inset-1 bg-foreground/20 rounded-full blur"></div>
                      <img
                        src={user.picture}
                        alt={user.name || "Profile"}
                        className="relative w-32 h-32 rounded-full border-4 border-border object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-foreground/10 rounded-full border-4 border-border flex items-center justify-center">
                      <User size={48} className="text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {user.name || user.nickname || "User"}
                  </h2>
                  <p className="text-muted-foreground text-xl mb-4 flex items-center justify-center md:justify-start gap-2">
                    <Mail size={20} />
                    {user.email || "No email provided"}
                  </p>
                  
                  {/* Verification Badge */}
                  {user.email_verified && (
                    <div className="inline-flex items-center gap-2 bg-foreground/10 rounded-full px-4 py-2">
                      <Shield size={16} className="text-foreground" />
                      <span className="text-foreground text-sm font-medium">Verified Account</span>
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
                  <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <User size={24} />
                    Personal Information
                  </h3>
                  
                  <div className="space-y-4">
                    {user.given_name && (
                      <div className="bg-foreground/5 rounded-xl p-4 border border-border">
                        <label className="block text-muted-foreground text-sm font-medium mb-2">First Name</label>
                        <p className="text-foreground text-lg font-medium">{user.given_name}</p>
                      </div>
                    )}
                    
                    {user.family_name && (
                      <div className="bg-foreground/5 rounded-xl p-4 border border-border">
                        <label className="block text-muted-foreground text-sm font-medium mb-2">Last Name</label>
                        <p className="text-foreground text-lg font-medium">{user.family_name}</p>
                      </div>
                    )}
                    
                    {user.nickname && (
                      <div className="bg-foreground/5 rounded-xl p-4 border border-border">
                        <label className="block text-muted-foreground text-sm font-medium mb-2">Nickname</label>
                        <p className="text-foreground text-lg font-medium">{user.nickname}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Settings size={24} />
                    Account Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-foreground/5 rounded-xl p-4 border border-border">
                      <label className="block text-muted-foreground text-sm font-medium mb-2">Full Name</label>
                      <p className="text-foreground text-lg font-medium">
                        {user.name || "Not provided"}
                      </p>
                    </div>
                    
                    <div className="bg-foreground/5 rounded-xl p-4 border border-border">
                      <label className="block text-muted-foreground text-sm font-medium mb-2">Email Address</label>
                      <p className="text-foreground text-lg font-medium">
                        {user.email || "Not provided"}
                      </p>
                    </div>
                    
                    <div className="bg-foreground/5 rounded-xl p-4 border border-border">
                      <label className="block text-muted-foreground text-sm font-medium mb-2">Email Status</label>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        user.email_verified 
                          ? 'bg-foreground/20 text-foreground' 
                          : 'bg-muted/50 text-muted-foreground'
                      }`}>
                        <Shield size={14} />
                        {user.email_verified ? "Verified" : "Not Verified"}
                      </div>
                    </div>

                    {user.sub && (
                      <div className="bg-foreground/5 rounded-xl p-4 border border-border">
                        <label className="block text-muted-foreground text-sm font-medium mb-2">User ID</label>
                        <p className="text-muted-foreground text-sm font-mono break-all">
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
            className="group relative bg-foreground text-background font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 text-center"
          >
            <span className="flex items-center justify-center gap-2">
              <Calendar size={20} />
              Go to Dashboard
            </span>
          </Link>
          <a
            href="/auth/logout"
            className="group relative bg-muted/80 backdrop-blur-sm border border-border text-foreground font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-muted text-center"
          >
            <span className="flex items-center justify-center gap-2">
              <LogOut size={20} />
              Logout
            </span>
          </a>
        </div>

        {/* Debug Information (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-12 bg-muted/50 backdrop-blur-sm border border-border rounded-2xl p-6">
            <h3 className="text-foreground font-bold mb-4 flex items-center gap-2">
              <Settings size={20} />
              Debug Information (Development Only)
            </h3>
            <div className="bg-background/50 rounded-xl p-4 overflow-auto">
              <pre className="text-muted-foreground text-xs">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
