import { EyeIcon } from "@heroicons/react/24/outline";
import Loader from "./Loader";
import { CharacterType } from "@/types/Character";

function CharacterList({ characters, isLoading }: { characters: CharacterType[], isLoading: boolean }) {
  if (isLoading) return <div className="characters-list"><Loader /></div>;
  return (
    <div className="characters-list">
      {characters.map((item) => (
        <Character key={item.id} item={item} />
      ))}
    </div>
  );
}

export default CharacterList;

function Character({ item }: { item: CharacterType }) {
  return (
    <div className="list__item">
      <img src={item.image} alt={item.name} />
      <h3 className="name">
        <span>{item.gender === "Male" ? "👨🏻" : "👩🏻"}</span>
        <span>{item.name}</span>
      </h3>
      <div className="list-item__info">
        <span
          className={`status ${item.status === "Dead" ? "red" : ""}`}
        ></span>
        <span> {item.status} </span>
        <span> - {item.species} </span>
      </div>
      <button className="icon red">
        <EyeIcon />
      </button>
    </div>
  );
}
