import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CharacterType } from "../types/Character";
export default function useCharacters(url: string, query: string) {
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${url}=${query}`, { signal });
        setCharacters(data.results.slice(0, 5));
      } catch (err: unknown) {
        setCharacters([]);
        if (axios.isAxiosError(err)) {
          toast.error(err.response?.data?.error || "An error occurred");
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [query, url]);
  return { characters, isLoading };
}
