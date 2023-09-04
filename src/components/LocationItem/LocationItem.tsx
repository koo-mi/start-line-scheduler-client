import EditIcon from '@mui/icons-material/Edit';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { locationItem } from '../../model/type';

interface OwnProps extends locationItem {
    handleDeleteOpen(id: string): void,
    handleEditOpen(id: string): void
}

const LocationItem = ({ id, handleDeleteOpen, handleEditOpen, name, street, city, province }: OwnProps) => {
    return (
        <div className="location__item-box">
            <div className="location__item-heading-box">
                {/* Location Name */}
                <h3 className="location__item-heading">{name}</h3>
                {/* Icon */}
                <div className="location__item-icon-box">
                    <EditIcon fontSize="small" onClick={()=>{handleEditOpen(`${id}`)}} />
                    <BackspaceIcon fontSize="small" onClick={()=>{handleDeleteOpen(`${id}`)}} />
                </div>
            </div>
        <p>{street}, {city}, {province}</p>
        </div>
    );
};

export default LocationItem;