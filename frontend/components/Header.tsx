import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold tracking-wide">
          📸 Social Feed
        </Link>
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                href="/create"
                className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition transform hover:scale-105"
              >
                ✏️ Create Post
              </Link>
            </>
          ) : (
            <span className="text-lg">Welcome</span>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
