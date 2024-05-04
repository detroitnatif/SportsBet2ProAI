import React from 'react'


interface LevelCardProps {
    name: string;
    description: string;
    onClick: () => void;
}

const LevelCard: React.FC<LevelCardProps> = ({ name, description, onClick }) => {
    return (
        <div className="bg-white p-4 m-4 shadow rounded-lg cursor-pointer hover:bg-gray-100" onClick={onClick}>
            <h4 className="font-medium text-lg text-gray-900">{name}</h4>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default LevelCard;
