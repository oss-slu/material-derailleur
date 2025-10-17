import React from 'react';
import '../css/ProgramCard.css';
import { useNavigate } from 'react-router-dom';

/**
 * Type definition for the ProgramProps.
 * @interface ProgramProps
 * @property {Object} program - The program object.
 * @property {number} program.id - The unique ID of the program.
 * @property {string} program.name - The name of the program.
 * @property {string} program.description - The description of the program.
 * @property {string} program.startDate - The start date of the program (in ISO string format).
 * @property {string} program.aimAndCause - The aim and cause of the program.
 */
interface ProgramProps {
    program: {
        id: number;
        name: string;
        description: string;
        startDate: string;
        aimAndCause: string;
    };
}


/**
 * ProgramCard component displays information about a single program.
 * @component
 * @param {ProgramProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered ProgramCard component.
 */
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
