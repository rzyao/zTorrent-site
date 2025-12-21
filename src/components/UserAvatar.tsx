interface UserAvatarProps {
  username?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  avatarUrl?: string | null;
}

export function UserAvatar({ username = 'User', size = 'md', className = '', avatarUrl = null }: UserAvatarProps) {
  // 根据用户名生成颜色
  const getColorFromUsername = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'from-amber-500 to-orange-600',
      'from-blue-500 to-cyan-600',
      'from-green-500 to-emerald-600',
      'from-purple-500 to-pink-600',
      'from-red-500 to-rose-600',
      'from-indigo-500 to-blue-600',
      'from-yellow-500 to-amber-600',
      'from-teal-500 to-green-600',
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const colorClass = getColorFromUsername(username);
  const initial = username.charAt(0).toUpperCase();

  if (typeof avatarUrl === 'string' && avatarUrl.trim().length > 0) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className={`rounded-full object-cover shadow-lg ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-linear-to-br ${colorClass} flex items-center justify-center text-white shadow-lg ${sizeClasses[size]} ${className}`}
    >
      {initial}
    </div>
  );
}
