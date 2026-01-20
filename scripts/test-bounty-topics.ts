// 开发测试脚本：验证 fetchBountyTopics 的参数映射与响应处理
// 运行方式：pnpm test:bounty
import { fetchBountyTopics } from "@/modules/app/pages/Home/hooks/useBountyTopics";
import { ForumsTopicsService } from "@/api/services/ForumsTopicsService";
import { ListBountyTopicsDto } from "@/api/models/ListBountyTopicsDto";

// 简单的 Mock 响应数据（符合 TopicPaginatedResponseDto 结构）
const mockResponse = {
  data: {
    items: [
      {
        id: "t1",
        title: "求 4K UHD 原盘合集",
        views: 123,
        replyCount: 5,
        updatedAt: new Date().toISOString(),
        bounty: { id: "b1", amount: "5000", status: "open" },
      },
      {
        id: "t2",
        title: "求 动漫全集 高码率",
        views: 456,
        replyCount: 12,
        updatedAt: new Date().toISOString(),
        bounty: { id: "b2", amount: "3000", status: "open" },
      },
    ],
    total: 2,
    page: 1,
    limit: 8,
    totalPages: 1,
  },
};

// 覆写 ForumsTopicsService 的调用为 Mock（开发脚本作用域内有效）
(ForumsTopicsService as any).topicsControllerListBountyTopics = async (_: ListBountyTopicsDto) => {
  return mockResponse;
};

async function main() {
  const body: ListBountyTopicsDto = { page: 1, limit: 8, sort: ListBountyTopicsDto.sort.LATEST };
  const result = await fetchBountyTopics(body);
  console.log("[测试结果] items.length:", result.items.length);
  console.log("[测试结果] 第一项标题:", result.items[0].title);
  console.log("[测试结果] 第一项悬赏:", result.items[0].bounty?.amount);
  console.log("[测试结果] total:", result.total, "page:", result.page, "limit:", result.limit);
}

main().catch((err) => {
  console.error("测试失败：", err);
  process.exit(1);
});

