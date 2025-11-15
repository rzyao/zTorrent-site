import { Search, Bell, Mail, User, TrendingUp, Upload, Download } from 'lucide-react';
import { Button } from './ui/button';
import { NavLink } from 'react-router-dom';

export function Header() {
  return (
    <header className="sticky h-16 bg-[#0F171E] z-50 px-4 md:px-8 border-b border-gray-800" style={{ top: '-64px' }}>
      <div className="flex items-center justify-between h-full max-w-[1920px] mx-auto">
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-1">
            <span className="text-white text-2xl">PT</span>
            <span className="text-[#00A8E1] text-2xl">Tracker</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className="text-white hover:text-gray-300 transition-colors">首页</NavLink>
            <NavLink to="/torrents" className="text-white hover:text-gray-300 transition-colors">种子</NavLink>
            <NavLink to="/forum" className="text-white hover:text-gray-300 transition-colors">论坛</NavLink>
            <NavLink to="/subtitles" className="text-white hover:text-gray-300 transition-colors">字幕</NavLink>
            <NavLink to="/ranking" className="text-white hover:text-gray-300 transition-colors">排行榜</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-400">
              <Upload className="w-4 h-4" />
              <span>5.28TB</span>
            </div>
            <div className="flex items-center gap-1 text-red-400">
              <Download className="w-4 h-4" />
              <span>2.15TB</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-400">
              <TrendingUp className="w-4 h-4" />
              <span>2.46</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 rounded-none relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 rounded-none relative"
          >
            <Mail className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 rounded-none"
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 rounded-none"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
