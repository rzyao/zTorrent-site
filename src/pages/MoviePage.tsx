import { useParams } from 'react-router-dom';

export default function MoviePage() {
  const { category } = useParams();
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-white">Movies {category ? `- ${category}` : ''}</h1>
      </div>
    </>

  );
}
