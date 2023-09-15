import "./DirectionTimeOutput.scss";
import transitIcon from "../../assets/icons/transit_icon.svg";
import { directionSummary } from "../../model/type";

interface OwnProps  {
    directionData: directionSummary | null,
    isHome: boolean
}

const DirectionTimeOutput = ({directionData, isHome}: OwnProps) => {
    return (
        <div className={`direction__container ${isHome ? "": "direction__container--border-bottom"}`}>
            <div className="direction__text-container">
                <p className='direction__text'>{sessionStorage.type === "arrival" ? "You need to leave by..." : "You will get there at..."}</p>
            </div>
            <div className="direction__display-container">
                <img src={transitIcon} alt="transit icon" className='direction__mode-icon' />
                <div className='direction__time-box'>
                    <h3 className='direction__time'>
                        {sessionStorage.type === "arrival" ? `${directionData!.departureTime}` : `${directionData!.arrivalTime}`}</h3>
                </div>
            </div>
        </div>
    );
};

export default DirectionTimeOutput;