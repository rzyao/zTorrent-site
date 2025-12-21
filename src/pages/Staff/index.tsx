import { Users } from "lucide-react";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { RoleFilter } from "./components/RoleFilter";
import { IntroBanner } from "./components/IntroBanner";
import { RecruitmentSection } from "./components/RecruitmentSection";
import { StaffCard } from "./components/StaffCard";
import { staffMembers } from "./data";
import { roleConfig } from "./constants";
import { useStaffFilters } from "./hooks/useStaffFilters";

/**
 * 管理组
 *
 * 说明：组合拆分后的子组件与业务 Hook，保持原有页面布局与交互。
 */
export function StaffPage() {
  useDynamicTitle("管理组");
  const { selectedRole, setSelectedRole, filteredMembers, roleStats } =
    useStaffFilters(staffMembers);

  return (
    <div className="min-h-screen bg-[#0F171E]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-4 py-4">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">管理组</h1>
              <p className="text-neutral-400 text-sm mt-1">
                认识我们的管理团队，他们为站点的运营贡献力量
              </p>
            </div>
          </div>
        </div>

        <IntroBanner />

        <RoleFilter
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          roleConfig={roleConfig}
          roleStats={roleStats}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <StaffCard
              key={member.id}
              member={member}
              roleConfig={roleConfig}
            />
          ))}
        </div>

        <RecruitmentSection />
      </div>
    </div>
  );
}
