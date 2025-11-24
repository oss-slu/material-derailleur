import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';
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

        // scroll to top of body when opening
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
                contentLabel="Donor Details"
            >
                {/* header fixed at top */}
                <div className="modal-header">Details</div>

                {/* scrollable body – scrollbar at right curve */}
                {donorDetails && (
                    <div className="modal-body">
                        <div className="details-list">
                            <div className="detail-row">
                                <span className="detail-label">Donor ID:</span>
                                <span className="detail-value">
                                    {donorDetails.id}
                                </span>
                            </div>

                            <div className="detail-row">
                                <span className="detail-label">
                                    First Name:
                                </span>
                                <span className="detail-value">
                                    {donorDetails.firstName}
                                </span>
                            </div>

                            <div className="detail-row">
                                <span className="detail-label">Last Name:</span>
                                <span className="detail-value">
                                    {donorDetails.lastName}
                                </span>
                            </div>

                            <div className="detail-row">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">
                                    {donorDetails.email}
                                </span>
                            </div>

                            <div className="detail-row">
                                <span className="detail-label">
                                    Contact Number:
                                </span>
                                <span className="detail-value">
                                    {donorDetails.contact}
                                </span>
                            </div>

                            <div className="detail-row">
                                <span className="detail-label">
                                    Address Line 1:
                                </span>
                                <span className="detail-value">
                                    {donorDetails.addressLine1}
                                </span>
                            </div>

                            <div className="detail-row">
                                <span className="detail-label">
                                    Address Line 2:
                                </span>
                                <span className="detail-value">
                                    {donorDetails.addressLine2}
                                </span>
                            </div>

                            <div className="detail-row">
                                <span className="detail-label">City:</span>
                                <span className="detail-value">
                                    {donorDetails.city}
                                </span>
                            </div>

                            <div className="detail-row">
                                <span className="detail-label">State:</span>
                                <span className="detail-value">
                                    {donorDetails.state}
                                </span>
                            </div>

                            <div className="detail-row">
                                <span className="detail-label">Zipcode:</span>
                                <span className="detail-value">
                                    {donorDetails.zipcode}
                                </span>
                            </div>

                            <div className="detail-row">
                                <span className="detail-label">
                                    Opted in for Emails:
                                </span>
                                <span className="detail-value">
                                    {donorDetails.emailOptIn ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* actions fixed at bottom */}
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
