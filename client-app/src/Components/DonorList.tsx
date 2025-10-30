import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import Modal from 'react-modal';
import '../css/DonorList.css';

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
    const [donorDetails, selectedDonorDetails] = useState<Donor | null>(null);
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
        selectedDonorDetails(donor);
        setModalIsOpen(true);
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
            {/* Page header to match the Programs page */}
            <header className="page-header">
                <h1 className="page-title">Donors</h1>
                <button
                    className="btn btn-primary header-action"
                    onClick={handleAddNewDonorClick}
                >
                    <FaPlus style={{ marginRight: 8 }} /> Add Donor
                </button>
            </header>

            {/* Search row */}
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
                        <FaSearch />
                    </button>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            {/* Content */}
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

            {/* Details Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                overlayClassName="modal-overlay"
                className="modal-container"
            >
                <h2 className="modal-header">Details</h2>
                {donorDetails && (
                    <div className="modal-content">
                        <p>
                            <strong>Donor ID:</strong> {donorDetails.id}
                        </p>
                        <p>
                            <strong>First Name:</strong>{' '}
                            {donorDetails.firstName}
                        </p>
                        <p>
                            <strong>Last Name:</strong> {donorDetails.lastName}
                        </p>
                        <p>
                            <strong>Email:</strong> {donorDetails.email}
                        </p>
                        <p>
                            <strong>Contact Number:</strong>{' '}
                            {donorDetails.contact}
                        </p>
                        <p>
                            <strong>Address Line 1:</strong>{' '}
                            {donorDetails.addressLine1}
                        </p>
                        <p>
                            <strong>Address Line 2:</strong>{' '}
                            {donorDetails.addressLine2}
                        </p>
                        <p>
                            <strong>City:</strong> {donorDetails.city}
                        </p>
                        <p>
                            <strong>State:</strong> {donorDetails.state}
                        </p>
                        <p>
                            <strong>Zipcode:</strong> {donorDetails.zipcode}
                        </p>
                        <p>
                            <strong>Opted in for Emails:</strong>{' '}
                            {donorDetails.emailOptIn ? 'Yes' : 'No'}
                        </p>
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
