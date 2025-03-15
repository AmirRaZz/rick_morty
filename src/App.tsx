import "./App.css";
import CharacterDetail from "./components/CharacterDetail";
import CharacterList from "./components/CharacterList";
import Navbar from "./components/Navbar";
import { allCharacters } from "../data/data.ts";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function App() {
  const [characters, setCharacters] = useState(allCharacters);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          "https://rickandmortyapi.com/api/character"
        );
        setCharacters(data.results.slice(0, 5));
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          // console.log(err.response?.data?.error);
          toast.error(err.response?.data?.error || "An error occurred");
        } else {
          // console.log("An unexpected error occurred");
          toast.error("An unexpected error occurred");
        }
        // toast.error(error instanceof Error ? error.message : String(error));
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="app">
      <Toaster />
      <Navbar numOfResult={characters.length} />
      <div className="main">
        <CharacterList characters={characters} isLoading={isLoading} />
        <CharacterDetail />
      </div>
    </div>
  );
}

export default App;
