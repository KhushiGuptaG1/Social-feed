import { useState, useEffect } from 'react';
import axios from 'axios';

const CommentSection = ({ feedId }: { feedId: number }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`/comments/${feedId}`);
      setComments(res.data);
    };
    fetch();
  }, [feedId]);

  const addComment = async () => {
    if (!text) return;
    await axios.post('/comments', { feedId, text });
    setComments([...comments, { text, user: { username: 'You' } }]);
    setText('');
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="font-semibold mb-3">Comments</h3>
      {comments.map((c, i) => (
        <div key={i} className="mb-2 p-2 bg-gray-50 rounded">
          <span className="font-semibold text-blue-600">{c.user.username}: </span>
          {c.text}
        </div>
      ))}
      <div className="flex mt-3">
        <input
          className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
        />
        <button
          onClick={addComment}
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentSection;