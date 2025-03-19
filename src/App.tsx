import "./App.css";
import CharacterDetail from "./components/CharacterDetail";
import CharacterList from "./components/CharacterList";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { CharacterType } from "./types/Character";
import useCharacters from "./hooks/useCharacter";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // const [favorites, setFavorites] = useState<CharacterType[]>(() =>
  //   JSON.parse(localStorage.getItem("FAVORITES") || "[]")
  // );

  // useEffect(() => {
  //   const controller = new AbortController();
  //   const signal = controller.signal;

  //   async function fetchData() {
  //     try {
  //       setIsLoading(true);
  //       const { data } = await axios.get(
  //         `https://rickandmortyapi.com/api/character?name=${query}`,
  //         { signal }
  //       );
  //       setCharacters(data.results.slice(0, 5));
  //     } catch (err: unknown) {
  //       // fetch => err.name === "AbortError"
  //       // axios => axios.isCancel()
  //       setCharacters([]);
  //       if (axios.isAxiosError(err)) {
  //         // console.log(err.response?.data?.error);
  //         toast.error(err.response?.data?.error || "An error occurred");
  //       } else {
  //         // console.log("An unexpected error occurred");
  //         toast.error("An unexpected error occurred");
  //       }
  //       // toast.err(err instanceof Error ? err.message : String(err));
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   if (query.length < 3) {
  //     setCharacters([]);
  //     return;
  //   }

  //   fetchData();
  //   return () => controller.abort();
  // }, [query]);

  const { characters, isLoading } = useCharacters(
    "https://rickandmortyapi.com/api/character/?name",
    query
  );

  // useEffect(() => {
  //   localStorage.setItem("FAVORITES", JSON.stringify(favorites));
  // }, [favorites]);

  const [favorites, setFavorites] = useLocalStorage("FAVORITES", "[]");

  const handleAddFavorite = (character: CharacterType) => {
    setFavorites((prevFavorites: CharacterType[]) => [
      ...prevFavorites,
      character,
    ]);
  };

  const onSelectCharacter = (id: number) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  const isAddToFavorites = favorites
    .map((fav: CharacterType) => fav.id)
    .includes(selectedId as number);

  const handleDeleteFavorite = (id: number) => {
    setFavorites((prevFavorites: CharacterType[]) =>
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
