import React from 'react'


interface LevelCardProps {
    name: string;
    description: string;
    selected: boolean;
    onSelect: () => void;
}

const selectedStyle = "ring-2 ring-yellow-500 bg-yellow-500 bg-opacity-10";
const unselectedStyle = "hover:bg-gray-100";

const LevelCard: React.FC<LevelCardProps> = ({ name, description, selected, onSelect }) => {
    return (
        <div className={`flex flex-col p-4 border border-gray-200 rounded ${selected ? selectedStyle : unselectedStyle}`} onClick={onSelect}>
            <h4 className="font-medium text-lg text-gray-900">{name}</h4>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default LevelCard;
