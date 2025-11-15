import { CategoryNav } from '@/components/CategoryNav';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';

export default function HomeLayout() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = category ?? (pathname.includes('/home/movies') ? '电影' : '全部');
  return (
    <>
      <CategoryNav
        active={active}
        onSelect={(c) => {
          if (c === '电影') navigate('/home/movies');
          else if (c === '全部') navigate('/home');
          else navigate(`/home/${encodeURIComponent(c)}`);
        }}
      />
      <Outlet />
    </>
  );
}
