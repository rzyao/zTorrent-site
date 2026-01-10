import { Breadcrumb } from 'antd'
import { useLocation } from 'react-router-dom'

const map: Record<string, string> = {
  '/': '首页',
  '/system': '系统设置',
  '/site': '网站设置',
  '/categories': '分类设置',
  '/torrents': '种子管理',
  '/forum': '论坛管理',
  '/users': '用户管理',
  '/roles': '角色管理',
  '/permissions': '权限管理',
}

export default function PageHeader() {
  const { pathname } = useLocation()
  const key = Object.keys(map).find((k) => pathname.startsWith(k)) || '/'
  const items = [
    { title: '管理后台' },
    { title: map[key] },
  ]
  return (
    <div style={{ marginBottom: 16 }}>
      {/* 移除页面左上角的标题 Title，避免与各页面的局部标题重复显示�?
          如需显示当前页面名称，可通过面包屑的最后一项体现，无需额外标题�?*/}
      <Breadcrumb items={items} />
    </div>
  )
}
