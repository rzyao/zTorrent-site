import { ListMoviesDto } from "@/api/models/ListMoviesDto";
import { MovieItem } from "./types";
import { Column } from "@/modules/admin/components/ui/data-table";
import { Tag } from "@/modules/admin/components/ui/tag";
import { Button } from "@/modules/admin/components/ui/button";

interface GetColumnsProps {
  sortBy?: ListMoviesDto.sortBy;
  sortOrder?: ListMoviesDto.order;
  onDetail: (id: string) => void;
  onRemove: (id: string) => void;
}

/**
 * 封装表格列定义 (只读模式，无编辑按钮)
 */
export const getFilmsColumns = ({
  sortBy,
  sortOrder,
  onDetail,
  onRemove,
}: GetColumnsProps): Column<MovieItem>[] => [
  { key: "id", title: "ID", dataIndex: "id", width: 140 },
  { key: "title", title: "标题", dataIndex: "title" },
  {
    key: "originalTitle",
    title: "原名",
    dataIndex: "originalTitle",
  },
  {
    key: "year",
    title: "年份",
    dataIndex: "year",
    sorter: true,
    sortOrder:
      sortBy === ListMoviesDto.sortBy.YEAR
        ? sortOrder === ListMoviesDto.order.ASC
          ? "asc"
          : "desc"
        : null,
  },
  {
    key: "categories",
    title: "分类",
    dataIndex: "categories",
    render: (cats: string[]) => (
      <div className="flex flex-wrap gap-1">
        {cats?.map((c) => (
          <Tag key={c}>{c}</Tag>
        ))}
      </div>
    ),
  },
  {
    key: "rating",
    title: "评分",
    dataIndex: "rating",
    sorter: true,
    sortOrder:
      sortBy === ListMoviesDto.sortBy.RATING
        ? sortOrder === ListMoviesDto.order.ASC
          ? "asc"
          : "desc"
        : null,
  },
  {
    key: "viewsCount",
    title: "热度",
    dataIndex: "viewsCount",
    sorter: true,
    sortOrder:
      sortBy === ListMoviesDto.sortBy.VIEWS_COUNT
        ? sortOrder === ListMoviesDto.order.ASC
          ? "asc"
          : "desc"
        : null,
  },
  {
    key: "actions",
    title: "操作",
    align: "right",
    render: (_, record) => (
      <div className="flex justify-end gap-1">
        <Button variant="link" onClick={() => onDetail(record.id!)}>
          详情
        </Button>
        <Button variant="link" danger onClick={() => onRemove(record.id!)}>
          删除
        </Button>
      </div>
    ),
  },
];
