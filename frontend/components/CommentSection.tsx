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
    <div className="mt-2">
      {comments.map((c, i) => (
        <div key={i}>
          <span className="font-bold">{c.user.username}: </span>
          {c.text}
        </div>
      ))}
      <input className="border" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={addComment}>Add</button>
    </div>
  );
};

export default CommentSection;