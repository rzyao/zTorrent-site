import { useMemo, useCallback } from "react";
import { useFilmsLogic } from "./hooks/useFilmsLogic";
import { ListMoviesDto } from "@/api/models/ListMoviesDto";
import { DataTable } from "@/modules/admin/components/ui/data-table";
import { Input } from "@/modules/admin/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/admin/components/ui/select";
import { ConfirmModal } from "@/modules/admin/components/ui/modal";
import { Search } from "@/modules/admin/components/ui/search";
import { getFilmsColumns } from "./columns";

/**
 * 电影管理列表页 (只读模式)
 */
export default function FilmsList() {
  const {
    loading,
    items,
    total,
    page,
    setPage,
    limit,
    setLimit,
    keyword,
    setKeyword,
    category,
    setCategory,
    year,
    setYear,
    genreIdsText,
    setGenreIdsText,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedRowKeys,
    setSelectedRowKeys,
    deleteOpen,
    setDeleteOpen,
    categoryOptions,
    handleSearch,
    openRemove,
    remove,
    openDetail,
  } = useFilmsLogic();

  // 获取列定义 (无编辑)
  const columns = useMemo(
    () =>
      getFilmsColumns({
        sortBy,
        sortOrder,
        onDetail: openDetail,
        onRemove: openRemove,
      }),
    [sortBy, sortOrder, openDetail, openRemove],
  );

  // 排序处理
  const handleSortChange = useCallback(
    (columnKey: string, order: "asc" | "desc" | null) => {
      let apiField: ListMoviesDto.sortBy | undefined;
      if (columnKey === "year") apiField = ListMoviesDto.sortBy.YEAR;
      if (columnKey === "rating") apiField = ListMoviesDto.sortBy.RATING;
      if (columnKey === "viewsCount") apiField = ListMoviesDto.sortBy.VIEWS_COUNT;

      setSortBy(apiField);
      setSortOrder(
        order === "asc"
          ? ListMoviesDto.order.ASC
          : order === "desc"
            ? ListMoviesDto.order.DESC
            : undefined,
      );
      setPage(1);
    },
    [setSortBy, setSortOrder, setPage],
  );

  // 工具栏内容
  const toolbarLeft = (
    <>
      <Search
        placeholder="关键词"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onSearch={handleSearch}
        wrapperClassName="w-64"
      />

      <Select
        value={category || "__all__"}
        onValueChange={(v) => {
          setCategory(v === "__all__" ? undefined : v);
          setPage(1);
        }}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="分类" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">全部分类</SelectItem>
          {categoryOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="年份"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="w-24"
      />

      <Input
        placeholder="Tag ID"
        value={genreIdsText}
        onChange={(e) => setGenreIdsText(e.target.value)}
        className="w-32"
      />
    </>
  );

  return (
    <div>
      <DataTable
        columns={columns}
        dataSource={items}
        rowKey="id"
        loading={loading}
        toolbarLeft={toolbarLeft}
        onSortChange={handleSortChange}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          onChange: (p, ps) => {
            setPage(p);
            setLimit(ps);
          },
        }}
      />

      <ConfirmModal
        title="确认删除"
        content="确定要删除该电影吗？此操作不可撤销。"
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onOk={remove}
      />
    </div>
  );
}
