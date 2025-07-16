import React from 'react';
import '../css/ProgramCard.css';
import { useNavigate } from 'react-router-dom';

interface ProgramProps {
    program: {
        id: number;
        name: string;
        description: string;
        startDate: string;
        aimAndCause: string;
    };
}

const ProgramCard: React.FC<ProgramProps> = ({ program }) => {
    const navigate = useNavigate();

    // Function to format date and remove time
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Extract only the date part (YYYY-MM-DD)
    };

    const handleEditClick = (program: ProgramProps['program']) => {
        localStorage.setItem('program', JSON.stringify(program));
        navigate('/editprogram');
    };

    return (
        <div className="program-card">
            <h2>{program.name}</h2>
            <p>
                <strong>Description:</strong> {program.description}
            </p>
            <p>
                <strong>Start Date:</strong> {formatDate(program.startDate)}
            </p>
            <p>
                <strong>Aim and Cause:</strong> {program.aimAndCause}
            </p>
            <button
                className="program-card"
                onClick={() => handleEditClick(program)}
            >
                Edit
            </button>
        </div>
    );
};

export default ProgramCard;
