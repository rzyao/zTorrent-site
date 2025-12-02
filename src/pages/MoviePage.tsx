import { useParams } from 'react-router-dom';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';

export default function MoviePage() {
  useDynamicTitle('电影');
  const { category } = useParams();
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-white">Movies {category ? `- ${category}` : ''}</h1>
      </div>
    </>

  );
}
