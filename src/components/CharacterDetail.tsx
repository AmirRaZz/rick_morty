import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CharacterType } from "@/types/Character";
import Loader from "./Loader";
import toast from "react-hot-toast";
import { EpisodeType } from "@/types/Episode";

function CharacterDetail({
  selectedId,
  onAddFavorite,
  isAddToFavorites,
}: {
  selectedId: number | null;
  onAddFavorite: (character: CharacterType) => void;
  isAddToFavorites: boolean;
}) {
  const [character, setCharacter] = useState<CharacterType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [episodes, setEpisodes] = useState<EpisodeType[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setCharacter(null);
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character/${selectedId}`
        );
        setCharacter(data);

        const episodesId = data.episode.map((e: string) => e.split("/").at(-1));
        const { data: episodeData } = await axios.get(
          `https://rickandmortyapi.com/api/episode/${episodesId}`
        );
        setEpisodes([episodeData].flat().slice(0, 6));
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.error || "Error fetching character"
          );
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (selectedId) fetchData();
  }, [selectedId]);

  if (isLoading)
    return (
      <div className="character-detail-container">
        <Loader />
      </div>
    );

  if (!character || !selectedId)
    return (
      <div className="character-detail-container empty-state">
        Please select a character
      </div>
    );

  return (
    <div className="character-detail-container">
      <CharacterSubInfo
        character={character}
        isAddToFavorites={isAddToFavorites}
        onAddFavorite={onAddFavorite}
      />
      <EpisodeList episodes={episodes} />
    </div>
  );
}

export default CharacterDetail;

const CharacterSubInfo: React.FC<{
  character: CharacterType;
  isAddToFavorites: boolean;
  onAddFavorite: (character: CharacterType) => void;
}> = ({ character, isAddToFavorites, onAddFavorite }) => {
  return (
    <div className="character-detail">
      <img
        src={character.image}
        alt={character.name}
        className="character-detail__img"
      />
      <div className="character-detail__info">
        <h3 className="name">
          <span>{character.gender === "Male" ? "👨🏻" : "👩🏻"}</span>
          <span>&nbsp;{character.name}</span>
        </h3>
        <div className="info">
          <span
            className={`status ${character.status === "Dead" ? "red" : ""}`}
          ></span>
          <span>&nbsp;{character.status}</span>
          <span>&nbsp; - &nbsp;{character.species}</span>
        </div>
        <div className="location">
          <p>Last known location:</p>
          <p>{character.location.name}</p>
        </div>
        <div className="actions">
          {isAddToFavorites ? (
            <p>Already added to favorites 💖</p>
          ) : (
            <button
              onClick={() => onAddFavorite(character)}
              className="btn btn--primary"
            >
              Add to Favorite
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const EpisodeList: React.FC<{ episodes: EpisodeType[] }> = ({ episodes }) => {
  const [sortBy, setSortBy] = useState(true);

  let sortedEpisodes;
  if (sortBy) {
    sortedEpisodes = [...episodes].sort(
      (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
    );
  } else {
    sortedEpisodes = [...episodes].sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    );
  }

  return (
    <div className="character-episodes">
      <div className="title">
        <h2>List of episodes:</h2>
        <button onClick={() => setSortBy((is) => !is)}>
          <ArrowUpCircleIcon
            className="icon"
            style={{ rotate: sortBy ? "0deg" : "180deg" }}
          />
        </button>
      </div>
      <ul>
        {sortedEpisodes.map((item, index) => (
          <li key={item.id}>
            <div>
              {String(index + 1).padStart(2, "0")} {item.episode} :{" "}
              <strong>{item.name}</strong>
            </div>
            <div className="badge badge--secondary">{item.air_date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
