这是一个基于 React + React Router 的完整 URL 参数透传方案。核心思想是：“上游负责传递，下游负责继承”。我们将定义两个 URL 参数 key，全程保持一致：source_playlist_id: 来源片单 IDsource_film_id: 来源影片 ID第一步：基础设施 (Utils & Hooks)我们需要一个 Hook 来统一处理“读取”和“生成”来源参数的逻辑，避免在每个页面重复写 searchParams.get。新建文件 useSourceTracker.js:JavaScriptimport { useSearchParams } from 'react-router-dom';

// 定义参数常量，防止手误
export const SOURCE_KEYS = {
  PLAYLIST: 'source_playlist_id',
  FILM: 'source_film_id',
};

/**
 * @param {string} [currentFilmId] - 如果当前页面就是 FilmDetail，需要传入当前的 ID
 */
export const useSourceTracker = (currentFilmId = '') => {
  const [searchParams] = useSearchParams();

  // 1. 获取 Source 数据
  // 优先取 URL 里的 filmId，如果当前就在 Film 页，则使用传入的 currentFilmId
  const sourceFilmId = currentFilmId || searchParams.get(SOURCE_KEYS.FILM) || '';
  const sourcePlaylistId = searchParams.get(SOURCE_KEYS.PLAYLIST) || '';

  // 构造发给后端的 source 对象
  const sourcePayload = {
    filmId: sourceFilmId,
    playListId: sourcePlaylistId,
  };

  // 2. 生成透传字符串 (用于 Link 跳转)
  // 当我们要跳到下一级页面时，需要把当前已知的 ID 全部带上
  const getNextQueryString = () => {
    const params = new URLSearchParams();
    if (sourcePlaylistId) params.set(SOURCE_KEYS.PLAYLIST, sourcePlaylistId);
    if (sourceFilmId) params.set(SOURCE_KEYS.FILM, sourceFilmId);
    return params.toString(); // 返回例如: "source_playlist_id=123&source_film_id=456"
  };

  return {
    sourcePayload,      // 用于 API 请求
    getNextQueryString, // 用于 <Link> 跳转
    playListId: sourcePlaylistId, // 单独暴露以便 UI 展示逻辑需要
  };
};
第二步：页面实现 (Page Implementation)按照你的用户路径，我们在三个关键节点植入代码。1. 片单详情页 (PlaylistDetailPage)这是源头。这里只产生 playListId，还没有 filmId。JavaScriptimport { Link } from 'react-router-dom';
import { SOURCE_KEYS } from './useSourceTracker';

const PlaylistDetailPage = ({ playlist }) => {
  // 假设 playlist.id = "PL_888"
  
  return (
    <div>
      <h1>{playlist.title}</h1>
      <div className="film-list">
        {playlist.films.map(film => (
          // 关键点：跳转到 Film 时，手动带上 source_playlist_id
          <Link 
            key={film.id} 
            to={`/film/${film.id}?${SOURCE_KEYS.PLAYLIST}=${playlist.id}`}
          >
            {film.title}
          </Link>
        ))}
      </div>
    </div>
  );
};
2. 影片详情页 (FilmDetailPage)这是中间节点。它不仅要消费 playListId，还要把自己作为 filmId 传给下一级。JavaScriptimport { useParams, Link } from 'react-router-dom';
import { useSourceTracker } from './useSourceTracker';

const FilmDetailPage = () => {
  const { id: currentFilmId } = useParams(); // URL 里的 /film/:id
  
  // 初始化 Hook，传入当前影片 ID
  const { sourcePayload, getNextQueryString } = useSourceTracker(currentFilmId);

  const handleDownload = (torrentId) => {
    // 【场景 1 & 3 & 5】：在这里直接下载
    // sourcePayload 会自动包含 playListId (如果有) 和当前的 filmId
    console.log('API Request:', {
      torrentId,
      source: sourcePayload 
    });
    // fetch('/torrents/download-url', { body: ... })
  };

  // 生成通往下一级（种子详情）的参数字符串
  // 这里的 queryString 会包含: source_playlist_id=xxx & source_film_id=当前ID
  const nextParams = getNextQueryString(); 

  return (
    <div>
      <h1>影片详情</h1>
      {/* 遍历种子列表 */}
      {torrents.map(t => (
        <div key={t.id}>
          {/* 直接下载按钮 */}
          <button onClick={() => handleDownload(t.id)}>下载</button>
          
          {/* 跳转种子详情：带上所有来源参数 */}
          <Link to={`/torrent/${t.id}?${nextParams}`}>
            查看详情
          </Link>
        </div>
      ))}
    </div>
  );
};
3. 种子详情页 (TorrentDetailPage)这是终点。它不需要知道自己是谁，只需要忠实地从 URL 读取所有上游信息。JavaScriptimport { useParams } from 'react-router-dom';
import { useSourceTracker } from './useSourceTracker';

const TorrentDetailPage = () => {
  const { id: torrentId } = useParams();

  // 这里不需要传参，因为 FilmId 已经作为 URL 参数存在了
  const { sourcePayload } = useSourceTracker(); 

  const handleDownload = () => {
    // 【场景 2 & 4】：在详情页下载
    // 无论是从哪里进来的，Hook 都会尝试从 URL 读取所有 ID
    console.log('API Request:', {
      torrentId,
      source: sourcePayload
    });
  };

  return (
    <div>
      <h1>种子详情: {torrentId}</h1>
      <button onClick={handleDownload}>确认下载</button>
    </div>
  );
};
第三步：验证场景 (Verification)让我们看看这套代码如何应对你的 5 种场景：场景用户路径URL 变化流转最终 sourcePayload结果1片单 -> 影片 -> 下载1. /film/F1?source_playlist_id=P12. 点击下载 (Film页){ filmId: 'F1', playListId: 'P1' }成功2片单 -> 影片 -> 种子 -> 下载1. /film/F1?source_playlist_id=P12. /torrent/T1?source_playlist_id=P1&source_film_id=F13. 点击下载 (Torrent页){ filmId: 'F1', playListId: 'P1' }成功3首页/搜索 -> 影片 -> 种子 -> 下载1. /film/F1 (无参数)2. /torrent/T1?source_film_id=F1 (无 playlist 参数)3. 点击下载{ filmId: 'F1', playListId: '' }成功4首页/搜索 -> 种子 -> 下载1. /torrent/T1 (无参数){ filmId: '', playListId: '' }成功5首页/搜索 -> 影片 -> 下载1. /film/F1 (无参数){ filmId: 'F1', playListId: '' }成功改进总结无状态化：不依赖任何全局 Store，完全依赖 URL，用户刷新页面、把链接发给朋友，来源追踪依然有效。解耦：useSourceTracker 封装了所有逻辑，页面组件不需要关心如何解析 URL，只需要调用 getNextQueryString() 传给 <Link> 即可。健壮性：即使参数缺失，也会优雅地降级为 '' (空字符串)，符合后端接口定义。