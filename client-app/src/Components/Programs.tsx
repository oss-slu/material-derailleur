import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/Programs.css';
import ProgramCard from './ProgramCard'; // Import the ProgramCard component

interface Program {
    id: number;
    name: string;
    description: string;
    startDate: string;
    aimAndCause: string;
}

function Programs() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await axios.get<Program[]>(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}program`,
                    {
                        headers: {
                            Authorization: localStorage.getItem('token'),
                        },
                    },
                );
                setPrograms(response.data);
            } catch (err) {
                setError('Error fetching programs');
                console.error('Error fetching programs:', err);
            }
        };

        fetchPrograms();
    }, []);

    return (
        <div className="programs-container">
            <h1>Programs</h1>
            <div className="add-program">
                <Link to="/addprogram">
                    <button className="add-program-button">Add Program</button>
                </Link>
            </div>
            <div className="program-list">
                {error ? (
                    <p className="error-message">Server Connection Refused</p>
                ) : programs.length > 0 ? (
                    programs.map(program => (
                        <ProgramCard key={program.id} program={program} />
                    ))
                ) : (
                    <p>No programs available.</p>
                )}
            </div>
        </div>
    );
}

export default Programs;
