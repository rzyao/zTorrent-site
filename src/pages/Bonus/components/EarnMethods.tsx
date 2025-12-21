import { earnMethods } from '../constants';

export function EarnMethods() {
  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" />
          </div>
          <div>
            <h3 className="text-white text-lg mb-2">什么是魔力值？</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              魔力值是本站的虚拟货币系统，您可以通过积极参与站点活动获得魔力值，并用于兑换各种特权和奖励。保持活跃，让您的魔力值持续增长！
            </p>
          </div>
        </div>
      </div>
      <h2 className="text-white text-xl mb-4">如何获得魔力值</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {earnMethods.map((method, index) => (
          <div key={index} className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 hover:border-amber-500/30 transition-all hover:shadow-lg hover:shadow-amber-500/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center shrink-0">
                <method.icon className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white">{method.title}</h3>
                  <span className="text-amber-400 text-sm">+{method.amount}</span>
                </div>
                <p className="text-neutral-400 text-sm">{method.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

