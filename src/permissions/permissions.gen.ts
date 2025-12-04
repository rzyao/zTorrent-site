/*
  自动生成：请勿手工修改
  来源：config/permissions.yaml
*/
export type PermissionCode = 'sys:manage' | 'sys:user' | 'sys:user:query' | 'sys:user:add' | 'review' | 'review:center' | 'review:query' | 'review:write'
export const ALL_PERMISSION_CODES: PermissionCode[] = ['sys:manage', 'sys:user', 'sys:user:query', 'sys:user:add', 'review', 'review:center', 'review:query', 'review:write']
export const PERMS = {
  "sys": {
    "manage": "sys:manage",
    "user": {
      "_": "sys:user",
      "query": "sys:user:query",
      "add": "sys:user:add"
    }
  },
  "review": {
    "_": "review",
    "center": "review:center",
    "query": "review:query",
    "write": "review:write"
  }
} as const
