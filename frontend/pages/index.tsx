import { useState, useEffect, useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import FeedCard from '../components/FeedCard';
import Header from '../components/Header';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user, login, register } = useContext(AuthContext);
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
      <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
        <div className="max-w-5xl w-full bg-white rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
          {/* Left side */}
          <div className="md:w-1/2 bg-gray-50 flex flex-col justify-center p-12">
            <h1 className="text-5xl font-extrabold text-blue-600 mb-6">Social-feed</h1>
            
          </div>

          {/* Right side - login/register form */}
          <div className="md:w-1/2 p-12 flex flex-col justify-center gap-6">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => login(username, password)}
              disabled={!username || !password}
              className="w-full bg-blue-600 text-white py-3 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
            >
              Log In
            </button>
            
            <hr />
            <button
              onClick={() => register(username, password)}
              disabled={!username || !password}
              className="w-full bg-green-600 text-white py-3 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      <Header />
      <div className="container mx-auto p-4 max-w-2xl">
        <InfiniteScroll
          dataLength={feeds.length}
          next={fetchFeeds}
          hasMore={hasMore}
          loader={
            <div className="text-center py-4 text-gray-500 font-medium">
              Loading more posts...
            </div>
          }
          endMessage={
            <p className="text-center text-sm text-gray-400 mt-4">
              You've reached the end of the feed.
            </p>
          }
        >
          {feeds.map((feed) => (
            <FeedCard key={feed.id} feed={feed} setFeeds={setFeeds} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Home;
