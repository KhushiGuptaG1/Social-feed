import { useState, useEffect, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "../lib/axiosSetup";
import { AuthContext } from "../context/AuthContext";
import FeedCard from "../components/FeedCard";
import { useRouter } from "next/router";

interface HeaderProps {
  onLogout: () => void;
  onCreatePost: () => void;
}
const Header: React.FC<HeaderProps> = ({ onLogout, onCreatePost }) => (
  <header className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-10 p-4">
    <div className="container mx-auto flex justify-between items-center max-w-2xl">
      <h1 className="text-xl font-bold text-purple-600">Social Feed</h1>
      <div className="flex space-x-4">
        <button
          onClick={onCreatePost}
          className="text-sm font-semibold text-purple-600 hover:text-purple-800"
        >
          Create Post
        </button>
        <button
          onClick={onLogout}
          className="text-sm font-semibold text-gray-600 hover:text-purple-600"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const Spinner = () => (
  <div className="flex justify-center items-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
  </div>
);

const EmptyFeed = ({ onCreatePost }: { onCreatePost: () => void }) => (
  <div className="text-center bg-white p-8 rounded-xl shadow-md border border-gray-200 mt-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">
      Welcome to Your Feed!
    </h2>
    <p className="text-gray-500 mb-6">
      It's looking a little empty here. Share what's on your mind.
    </p>
    <button
      onClick={onCreatePost}
      className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition shadow-md"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Create Your First Post
    </button>
  </div>
);

const Home = () => {
  const router = useRouter();
  const { user, login, register, logout } = useContext(AuthContext);

  const [feeds, setFeeds] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState("");

  const fetchFeeds = async () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);
    try {
      const res = await axios.get(`/feeds?page=${page}&limit=10`);
      const newFeeds = res.data || [];
      setFeeds((prev) => {
        const combined = [...prev, ...newFeeds];
        const unique = combined.filter((feed, index, self) => self.findIndex(f => f.id === feed.id) === index);
        return unique;
      });
      if (newFeeds.length < 10) setHasMore(false);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setHasMore(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFeeds([]);
      setPage(1);
      setHasMore(true);
      fetchFeeds();
    }
  }, [user]);

  const handleAuthAction = async (action: "login" | "register") => {
    if (!username || !password) return;
    setIsLoading(true);
    setError("");
    try {
      if (action === "login") await login(username, password);
      else {
        await register(username, password);
        setToast("Account created successfully! Now you can log in.");
        setTimeout(() => setToast(""), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Unexpected error.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-purple-300 flex flex-col justify-center items-center p-4">
        <div className="max-w-sm w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-600 mb-2">
              Social Feed
            </h1>
            <p className="text-gray-500">Connect, share, and discover.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            <h2 className="text-xl font-semibold text-gray-700 text-center">
              Welcome!
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); handleAuthAction("login"); }}>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon />
                </span>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>

              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockIcon />
                </span>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <div className="space-y-4 pt-2">
                <button
                  type="submit"
                  disabled={!username || !password || isLoading}
                  className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 hover:bg-purple-600 transition transform hover:-translate-y-0.5 shadow-md"
                >
                  {isLoading ? "Logging In..." : "Log In"}
                </button>
              </div>
            </form>

            <div className="flex items-center">
              <div className="flex-grow bg-gray-200 h-px"></div>
              <span className="mx-4 text-xs text-gray-400">OR</span>
              <div className="flex-grow bg-gray-200 h-px"></div>
            </div>

            <button
              onClick={() => handleAuthAction("register")}
              disabled={!username || !password || isLoading}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold border border-gray-300 disabled:opacity-50 hover:bg-gray-200 transition"
            >
              {isLoading ? "Creating..." : "Create New Account"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={logout} onCreatePost={() => router.push("/create")} />
      <main className="container mx-auto p-4 max-w-2xl">
        {user ? (
          feeds.length === 0 && !isFetching ? (
            <EmptyFeed onCreatePost={() => router.push("/create")} />
          ) : (
            <InfiniteScroll
              dataLength={feeds.length}
              next={fetchFeeds}
              hasMore={hasMore}
              loader={<Spinner />}
              endMessage={
                <p className="text-center text-sm text-gray-500 py-6">
                  👋 You've reached the end!
                </p>
              }
            >
              {feeds.map((feed) => (
                <FeedCard key={feed.id} feed={feed} setFeeds={setFeeds} />
              ))}
            </InfiniteScroll>
          )
        ) : (
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 w-full max-w-md">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Welcome to Social Feed
              </h2>
              {toast && (
                <div className="mb-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
                  {toast}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <UserIcon />
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <LockIcon />
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <div className="space-y-4 pt-2">
                  <button
                    onClick={() => handleAuthAction("login")}
                    disabled={!username || !password || isLoading}
                    className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 hover:bg-purple-600 transition transform hover:-translate-y-0.5 shadow-md"
                  >
                    {isLoading ? "Logging In..." : "Log In"}
                  </button>

                  <div className="flex items-center">
                    <div className="flex-grow bg-gray-200 h-px"></div>
                    <span className="mx-4 text-xs text-gray-400">OR</span>
                    <div className="flex-grow bg-gray-200 h-px"></div>
                  </div>

                  <button
                    onClick={() => handleAuthAction("register")}
                    disabled={!username || !password || isLoading}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold border border-gray-300 disabled:opacity-50 hover:bg-gray-200 transition"
                  >
                    {isLoading ? "Creating..." : "Create New Account"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
