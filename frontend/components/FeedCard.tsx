import { useState } from "react";
import CommentSection from "./CommentSection";
import axios from "../lib/axiosSetup";

const timeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
};

const FeedCard = ({ feed, setFeeds }: { feed: any; setFeeds: any }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50));

  const report = async () => {
    try {
      await axios.post("/reports", { feedId: feed.id });
      // The feed will be hidden from the feed list when report count reaches 3
      alert("Report submitted. The post will be hidden if it receives 3 reports.");
    } catch (e) {
      console.error(e);
      alert("Failed to report.");
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="bg-white p-4 mb-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-md">
          {feed.user?.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold">{feed.user?.username}</div>
          <div className="text-gray-500 text-sm">{timeAgo(feed.createdAt)}</div>
        </div>
      </div>
      <div className="mb-3">{feed.text}</div>

      {feed.images && feed.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {feed.images.map((img: string, i: number) => {
            let className = "w-full h-auto object-cover rounded-lg";
            if (feed.images.length === 3 && i === 0) {
              className += " col-span-2";
            } else if (feed.images.length === 1) {
              className += " col-span-2";
            }
            return <img key={i} src={img} alt="" className={className} />;
          })}
        </div>
      )}
      <div className="flex items-center justify-around border-t pt-3">
        <button
          onClick={toggleLike}
          className={`flex items-center px-3 py-2 rounded transition ${liked ? "text-red-500" : "text-gray-600"} hover:bg-gray-100`}
        >
          {liked ? "❤️" : "🤍"} Like
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center text-purple-600 hover:bg-purple-100 px-3 py-2 rounded transition"
        >
          💬 Comments
        </button>
        <button
          onClick={report} // singular, matches your function
          className="flex items-center text-purple-600 hover:bg-purple-100 px-3 py-2 rounded transition"
        >
          Report
        </button>


      </div>
      {showComments && <CommentSection feedId={feed.id} />}
    </div>
  );
};

export default FeedCard;
