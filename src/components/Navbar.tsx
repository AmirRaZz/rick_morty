import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Modal from "./Modal";
import { CharacterType } from "@/types/Character";
import { Character } from "./CharacterList";

function Navbar({
  numOfResult,
  favorites,
  query,
  setQuery,
  onDeleteFavorite,
}: {
  numOfResult: number;
  favorites: CharacterType[];
  query: string;
  setQuery: (value: string) => void;
  onDeleteFavorite: (id: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

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
      <Modal title="List of Favorites" open={isOpen} onOpen={setIsOpen}>
        {favorites.map((item) => (
          <Character key={item.id} item={item}>
            <button
              className="icon red"
              onClick={() => onDeleteFavorite(item.id)}
            >
              <TrashIcon />
            </button>
          </Character>
        ))}
      </Modal>
      <button className="heart" onClick={() => setIsOpen((is) => !is)}>
        <HeartIcon className="icon" />
        <span className="badge">{favorites.length}</span>
      </button>
    </nav>
  );
}

export default Navbar;
