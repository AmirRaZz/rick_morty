import { HeartIcon } from "@heroicons/react/24/outline";

function Navbar({
  numOfResult,
  numOfFavorites,
  query,
  setQuery,
}: {
  numOfResult: number;
  numOfFavorites: number;
  query: string;
  setQuery: (value: string) => void;
}) {
  return (
    <nav className="navbar">
      <div className="navbar__logo">LOGO 😍</div>
      <input
        type="text"
        className="text-field"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <div className="navbar__result">Found {numOfResult} characters</div>
      <button className="heart">
        <HeartIcon className="icon" />
        <span className="badge">{numOfFavorites}</span>
      </button>
    </nav>
  );
}

export default Navbar;
