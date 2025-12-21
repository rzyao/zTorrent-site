import { Button } from "@/components/ui/button";

interface PaginationBarProps {
  /** 当前页码（从1开始） */
  currentPage: number;
  /** 总页数 */
  totalPages: number;
  /** 设置页码 */
  onChangePage: (page: number) => void;
}

/**
 * PaginationBar
 * 职责：底部分页逻辑与UI
 * 说明：纯UI组件，内部仅包含页码计算与按钮渲染。
 */
export function PaginationBar({
  currentPage,
  totalPages,
  onChangePage,
}: PaginationBarProps) {
  // 计算需要展示的最多5个页码，保证当前页居中显示（与旧页面逻辑一致）
  const computePages = (): number[] => {
    const pages: number[] = [];
    const len = Math.min(5, totalPages);
    for (let i = 0; i < len; i++) {
      let pageNum: number;
      if (totalPages <= 5) {
        pageNum = i + 1;
      } else if (currentPage <= 3) {
        pageNum = i + 1;
      } else if (
        currentPage >=
        totalPages - 2
      ) {
        pageNum = totalPages - 4 + i;
      } else {
        pageNum = currentPage - 2 + i;
      }
      pages.push(pageNum);
    }
    return pages;
  };

  const pages = computePages();

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        onClick={() =>
          onChangePage(
            Math.max(
              1,
              currentPage - 1,
            ),
          )
        }
        disabled={currentPage === 1}
        className="border-gray-700 bg-gray-900 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        上一页
      </Button>

      <div className="flex items-center gap-2">
        {pages.map((pageNum, i) => (
          <Button
            key={i}
            onClick={() =>
              onChangePage(pageNum)
            }
            className={`h-10 w-10 rounded-md transition-colors ${currentPage === pageNum ? "bg-[#00A8E1] text-white" : "bg-gray-900 text-gray-400 hover:bg-gray-800"}`}
          >
            {pageNum}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={() =>
          onChangePage(
            Math.min(
              totalPages,
              currentPage + 1,
            ),
          )
        }
        disabled={
          currentPage === totalPages
        }
        className="border-gray-700 bg-gray-900 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        下一页
      </Button>
    </div>
  );
}
