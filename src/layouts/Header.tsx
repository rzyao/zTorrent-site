import { Search, Bell, Mail, User, TrendingUp, Upload, Download, ChartSpline } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink, useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  return (
    <header className="sticky h-16 bg-[#0F171E] z-50 px-4 md:px-8 border-b border-gray-800" style={{ top: '-64px' }}>
      <div className="flex items-center justify-between h-full max-w-[1920px] mx-auto">
        <div className="flex items-center gap-8">
          <NavLink to="/home" className="flex items-center gap-1">
            <span className="text-white text-2xl">PT</span>
            <span className="text-[#00A8E1] text-2xl">Tracker</span>
          </NavLink>
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/home" className="text-white hover:text-gray-300 transition-colors">首页</NavLink>
            <NavLink to="/torrents" className="text-white hover:text-gray-300 transition-colors">种子</NavLink>
            <NavLink to="/forum" className="text-white hover:text-gray-300 transition-colors">论坛</NavLink>
            <NavLink to="/subtitles" className="text-white hover:text-gray-300 transition-colors">字幕</NavLink>
            <NavLink to="/ranking" className="text-white hover:text-gray-300 transition-colors">排行榜</NavLink>
            <NavLink to="/upload" className="text-white hover:text-gray-300 transition-colors">上传</NavLink>
            <NavLink to="/edit" className="text-white hover:text-gray-300 transition-colors">编辑</NavLink>
            <NavLink to="/control" className="text-white hover:text-gray-300 transition-colors">控制台</NavLink>
            <NavLink to="/tickets" className="text-white hover:text-gray-300 transition-colors">工单</NavLink>
            <NavLink to="/requests" className="text-white hover:text-gray-300 transition-colors">求种</NavLink>
            <NavLink to="/rules" className="text-white hover:text-gray-300 transition-colors">规则</NavLink>
            <NavLink to="/staff" className="text-white hover:text-gray-300 transition-colors">管理组</NavLink>
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
              <ChartSpline className="w-4 h-4" />
              <span>2.46</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 rounded-none relative"
            onClick={() => navigate('/messages?tab=system')}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 rounded-none relative"
            onClick={() => navigate('/messages?tab=inbox')}
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
