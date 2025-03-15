import "./App.css";
import CharacterDetail from "./components/CharacterDetail";
import CharacterList from "./components/CharacterList";
import Navbar from "./components/Navbar";
// import { allCharacters } from "../data/data.ts";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function App() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character?name=${query}`
        );
        setCharacters(data.results.slice(0, 5));
      } catch (err: unknown) {
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
  }, [query]);

  const onSelectCharacter = (id: number) => {
    console.log(id);
    setSelectedId(id);
  };

  return (
    <div className="app">
      <Toaster />
      <Navbar
        numOfResult={characters.length}
        query={query}
        setQuery={setQuery}
      />
      <div className="main">
        <CharacterList
          characters={characters}
          isLoading={isLoading}
          onSelectCharacter={onSelectCharacter}
        />
        <CharacterDetail selectedId={selectedId} />
      </div>
    </div>
  );
}

export default App;
