import { useState } from 'react';
import CommentSection from './CommentSection';
import axios from 'axios';

const FeedCard = ({ feed, setFeeds }: { feed: any; setFeeds: any }) => {
  const [showComments, setShowComments] = useState(false);

  const report = async () => {
    try {
      await axios.post('/reports', { feedId: feed.id });
      // Remove from list if hidden
      setFeeds((prev: any[]) => prev.filter((f) => f.id !== feed.id));
    } catch (e) {
      console.error(e);
    }
  };

  let gridClass = '';
  if (feed.images.length === 1) gridClass = 'grid-cols-1';
  else if (feed.images.length === 2) gridClass = 'grid-cols-2';
  else gridClass = 'grid-cols-2';

  return (
    <div className="bg-white p-4 mb-4 rounded shadow">
      <div className="font-bold">{feed.user.username}</div>
      <div>{feed.text}</div>
      {feed.images && feed.images.length > 0 && (
        <div className={`grid ${gridClass} gap-2 mt-2`}>
          {feed.images.map((img: string, i: number) => (
            <img key={i} src={img} alt="" className="w-full h-auto object-cover" />
          ))}
        </div>
      )}
      <button onClick={() => setShowComments(!showComments)}>Comments</button>
      <button onClick={report} className="ml-4">Report</button>
      {showComments && <CommentSection feedId={feed.id} />}
    </div>
  );
};

export default FeedCard;