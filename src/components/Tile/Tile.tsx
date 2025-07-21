import "./styles.css"
import failGif from "../../assets/gifs/fail.gif"
import winGif from "../../assets/gifs/win.gif"

export type TileType = {
    value: number;
    flipped: boolean; 
    onClick: (tile:number)=>void;
    passed: boolean;
    failed: boolean | null;
}
export const Tile: React.FC<TileType> = ({ value, flipped, onClick, passed, failed }) => {

    const handleOnClick = () => {
        onClick(value);
    }

  return (
    <div 
        className={`tile ${flipped && !passed ? "flip" : ""} ${passed ? "passed" : ""}`}
        onClick={handleOnClick}>
        <div className="tile-inner">
            <div className="tile-front">{passed && <img src={winGif}/>} {failed && <img src={failGif}/>}</div>
            <div className="tile-back"><p>{value}</p></div>
        </div>
    </div>
  );
};