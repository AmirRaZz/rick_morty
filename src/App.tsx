import "./App.css";
import CharacterDetail from "./components/CharacterDetail";
import CharacterList from "./components/CharacterList";
import Navbar from "./components/Navbar";
// import { allCharacters } from "../data/data.ts";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { CharacterType } from "./types/Character";

function App() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<CharacterType[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character?name=${query}`,
          { signal }
        );
        setCharacters(data.results.slice(0, 5));
      } catch (err: unknown) {
        // fetch => err.name === "AbortError"
        // axios => axios.isCancel()
        setCharacters([]);
        if (axios.isAxiosError(err)) {
          // console.log(err.response?.data?.error);
          toast.error(err.response?.data?.error || "An error occurred");
        } else {
          // console.log("An unexpected error occurred");
          toast.error("An unexpected error occurred");
        }
        // toast.err(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setCharacters([]);
      return;
    }

    fetchData();
    return () => controller.abort();
  }, [query]);

  const onSelectCharacter = (id: number) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  const handleAddFavorite = (character: CharacterType) => {
    setFavorites((prevFavorites) => [...prevFavorites, character]);
  };

  const isAddToFavorites = favorites
    .map((fav) => fav.id)
    .includes(selectedId as number);

  const handleDeleteFavorite = (id: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((fav) => fav.id !== id)
    );
  };

  return (
    <div className="app">
      <Toaster />
      <Navbar
        numOfResult={characters.length}
        favorites={favorites}
        query={query}
        setQuery={setQuery}
        onDeleteFavorite={handleDeleteFavorite}
      />
      <div className="main">
        <CharacterList
          selectedId={selectedId}
          characters={characters}
          isLoading={isLoading}
          onSelectCharacter={onSelectCharacter}
        />
        <CharacterDetail
          selectedId={selectedId}
          onAddFavorite={handleAddFavorite}
          isAddToFavorites={isAddToFavorites}
        />
      </div>
    </div>
  );
}

export default App;
