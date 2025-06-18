import React from 'react';

interface LogoProps {
  companyName?: string;
  size?: number;
}

const CompanyLogo: React.FC<LogoProps> = ({ companyName = '', size = 24 }) => {
  // Simple logo mapping - you can expand this based on your needs
  const logoMap: Record<string, string> = {
    'google': '🔍',
    'facebook': '📘',
    'twitter': '🐦',
    'instagram': '📷',
    'linkedin': '💼',
    'github': '👨‍💻',
    'adobe': '🎨',
    'microsoft': '🪟',
    'apple': '🍎',
    'amazon': '📦',
    'netflix': '🎬',
    'spotify': '🎵',
    'youtube': '📺',
    'tiktok': '🎭',
    'snapchat': '👻',
    'pinterest': '📌',
    'reddit': '🤖',
    'discord': '🎮',
    'slack': '💬',
    'zoom': '📹',
    'dropbox': '📁',
    'paypal': '💳',
    'ebay': '🛒',
    'uber': '🚗',
    'airbnb': '🏠',
    'tesla': '⚡',
    'nvidia': '🎯',
    'intel': '💻',
    'samsung': '📱',
    'sony': '🎮',
    'nintendo': '🎮',
    'steam': '🎮',
    'epic': '🎮',
    'twitch': '🎥',
    'vimeo': '🎬',
    'soundcloud': '🎵',
    'bandcamp': '🎵',
    'lastfm': '🎵',
    'deezer': '🎵',
    'pandora': '🎵',
    'tumblr': '📝',
    'medium': '📝',
    'wordpress': '📝',
    'blogger': '📝',
    'flickr': '📸',
    'deviantart': '🎨',
    'behance': '🎨',
    'dribbble': '🎨',
    'figma': '🎨',
    'sketch': '🎨',
    'canva': '🎨',
    'photoshop': '🎨',
    'illustrator': '🎨',
    'premiere': '🎬',
    'aftereffects': '🎬',
    'blender': '🎨',
    'unity': '🎮',
    'unreal': '🎮',
    'godot': '🎮',
    'minecraft': '🧱',
    'roblox': '🎮',
    'fortnite': '🎮',
    'valorant': '🎮',
    'csgo': '🎮',
    'dota': '🎮',
    'lol': '🎮',
    'overwatch': '🎮',
    'apex': '🎮',
    'pubg': '🎮',
    'cod': '🎮',
    'battlefield': '🎮',
    'fifa': '⚽',
    'madden': '🏈',
    'nba2k': '🏀',
    'mlb': '⚾',
    'nhl': '🏒'
  };

  const getCompanyIcon = (name: string): string => {
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check for exact matches first
    if (logoMap[normalizedName]) {
      return logoMap[normalizedName];
    }
    
    // Check for partial matches
    for (const [key, value] of Object.entries(logoMap)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return value;
      }
    }
    
    // Fallback to first letter or default icon
    return name.charAt(0).toUpperCase() || '🌐';
  };

  const icon = getCompanyIcon(companyName);

  return (
    <div 
      className="flex items-center justify-center text-white"
      style={{ fontSize: `${size}px`, lineHeight: 1 }}
      title={companyName}
    >
      {icon}
    </div>
  );
};

export default CompanyLogo; 