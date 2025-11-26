import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import '../css/DonorList.css';

Modal.setAppElement('#root');

interface Donor {
    id: number;
    firstName: string;
    lastName: string;
    contact: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipcode: string;
    emailOptIn: boolean;
}

const DonorList: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
    const [donorDetails, setDonorDetails] = useState<Donor | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [currentDonors, setCurrentDonors] = useState<Donor[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const response = await axios.get<Donor[]>(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}donor`,
                    {
                        headers: {
                            Authorization: localStorage.getItem('token') || '',
                        },
                    },
                );
                setCurrentDonors(response.data);
            } catch (err) {
                console.error('Error fetching donors:', err);
                setError('Error fetching donor data');
            }
        };
        fetchDonors();
    }, []);

    const handleSearch = () => {
        const query = searchInput.trim().toLowerCase();
        const filtered = currentDonors.filter(
            item =>
                item.id.toString().includes(query) ||
                item.firstName.toLowerCase().includes(query) ||
                item.lastName.toLowerCase().includes(query) ||
                item.email.toLowerCase().includes(query),
        );
        setFilteredDonors(filtered);
    };

    const handleAddNewDonorClick = () => navigate('/donorform');

    const handleViewDetailsClick = (donor: Donor) => {
        setDonorDetails(donor);
        setModalIsOpen(true);

        setTimeout(() => {
            const body = document.querySelector(
                '.modal-body',
            ) as HTMLElement | null;
            if (body) body.scrollTop = 0;
        }, 0);
    };

    const handleEditDonorClick = (donor: Donor | null) => {
        if (!donor) return;
        localStorage.setItem('donor', JSON.stringify(donor));
        navigate('/donoredit');
    };

    const donorsToShow =
        filteredDonors.length > 0 || searchInput
            ? filteredDonors
            : currentDonors;

    return (
        <div className="page">
            <header className="page-header">
                <h1 className="page-title">Donors</h1>
                <button
                    className="btn btn-primary header-action"
                    onClick={handleAddNewDonorClick}
                >
                    + Add Donor
                </button>
            </header>

            <div className="search-row">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search for donor"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        className="btn btn-primary search-button"
                        onClick={handleSearch}
                    >
                        🔍
                    </button>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            {donorsToShow.length === 0 ? (
                <div className="empty-state">No donors available.</div>
            ) : (
                <div className="card">
                    <div className="table-wrapper">
                        <table className="donor-table">
                            <thead>
                                <tr>
                                    <th>Donor ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>More Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donorsToShow.map(donor => (
                                    <tr key={donor.id}>
                                        <td>{donor.id}</td>
                                        <td>{donor.firstName}</td>
                                        <td>{donor.lastName}</td>
                                        <td>{donor.email}</td>
                                        <td>
                                            <button
                                                className="btn btn-link"
                                                onClick={() =>
                                                    handleViewDetailsClick(
                                                        donor,
                                                    )
                                                }
                                            >
                                                View More Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                overlayClassName="modal-overlay"
                className="modal-container"
                contentLabel="Donor Details"
            >
                <div className="modal-header">Details</div>
                {donorDetails && (
                    <div className="modal-body">
                        <div className="details-list">
                            {/* ...all your detail rows stay the same... */}
                        </div>
                    </div>
                )}
                <div className="modal-actions">
                    <button
                        className="btn btn-danger"
                        onClick={() => handleEditDonorClick(donorDetails)}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setModalIsOpen(false)}
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default DonorList;
