import { useState, useEffect, useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import FeedCard from '../components/FeedCard';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';

const Home = () => {
  const { user, login, register, logout } = useContext(AuthContext);
  const [feeds, setFeeds] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const fetchFeeds = async () => {
    try {
      const res = await axios.get(`/feeds?page=${page}&limit=10`);
      const newFeeds = res.data;
      setFeeds((prev) => [...prev, ...newFeeds]);
      if (newFeeds.length < 10) setHasMore(false);
      setPage(page + 1);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) fetchFeeds();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h1>Login or Register</h1>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={() => login(username, password)}>Login</button>
        <button onClick={() => register(username, password)}>Register</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <button onClick={logout}>Logout</button>
      <Link href="/create">Create Post</Link>
      <InfiniteScroll
        dataLength={feeds.length}
        next={fetchFeeds}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        {feeds.map((feed) => (
          <FeedCard key={feed.id} feed={feed} setFeeds={setFeeds} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Home;