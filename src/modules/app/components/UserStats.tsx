import { Upload, Download, HardDrive, Users, Award } from 'lucide-react';

export function UserStats() {
  return (
    <div className="bg-white border rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
          VIP
        </div>
        <div>
          <h3 className="text-gray-900">用户名</h3>
          <p className="text-sm text-gray-600">VIP会员 • 等级 10</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
            <Upload className="w-4 h-4" />
            <span className="text-xs">上传</span>
          </div>
          <p className="text-gray-900">5.28 TB</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
            <Download className="w-4 h-4" />
            <span className="text-xs">下载</span>
          </div>
          <p className="text-gray-900">2.15 TB</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
            <HardDrive className="w-4 h-4" />
            <span className="text-xs">分享率</span>
          </div>
          <p className="text-gray-900">2.46</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs">做种</span>
          </div>
          <p className="text-gray-900">156</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-yellow-600 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-xs">魔力值</span>
          </div>
          <p className="text-gray-900">18,542</p>
        </div>
      </div>
    </div>
  );
}
