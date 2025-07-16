import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import Modal from 'react-modal';
import '../css/AdminHeader.css';
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
    const [currentDonors, setCurrentDonors] = useState<Donor[]>([]); // initially empty array
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch donor data from the backend API
        const fetchDonors = async () => {
            try {
                const response = await axios.get<Donor[]>(
                    `${process.env.REACT_APP_BACKEND_API_BASE_URL}donor`,
                    {
                        headers: {
                            Authorization: localStorage.getItem('token'),
                        },
                    },
                );
                console.log('Fetched donor data:', response.data); // Log the response data
                setCurrentDonors(response.data); // Set the fetched data
            } catch (err) {
                console.error('Error fetching donors:', err);
                setError('Error fetching donor data');
            }
        };
        fetchDonors();
    }, []);

    const handleSearch = () => {
        const filtered = currentDonors.filter(
            item =>
                item.id.toString().includes(searchInput) ||
                item.firstName
                    .toLowerCase()
                    .includes(searchInput.toLowerCase()) ||
                item.lastName
                    .toLowerCase()
                    .includes(searchInput.toLowerCase()) ||
                item.email.includes(searchInput),
        );
        setFilteredDonors(filtered);
    };

    const handleAddNewDonorClick = () => {
        navigate('/donorform');
    };

    const handleViewDetailsClick = (donor: Donor) => {
        selectedDonorDetails(donor);
        setModalIsOpen(true);
    };

    const handleEditDonorClick = (donor: Donor | null) => {
        if (donor === null) {
            console.error("Donor doesn't exist");
        } else {
            localStorage.setItem('donor', JSON.stringify(donor));
            navigate('/donoredit');
        }
    };

    return (
        <div>
            <div className="header">
                <div className="logo-container">
                    <img
                        src="https://www.bworks.org/wp-content/themes/bworks/library/images/logo-bworks.png"
                        alt="BWorks Logo"
                        className="logo"
                    />
                </div>
                <div className="options">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search for donor"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                        <button
                            className="search-button"
                            onClick={handleSearch}
                        >
                            <FaSearch />
                        </button>
                    </div>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="div-topAddDonor">
                <button onClick={handleAddNewDonorClick}>Add New Donor</button>
            </div>

            <table className="donor-list">
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
                    {(filteredDonors.length > 0
                        ? filteredDonors
                        : currentDonors
                    ).map((donor, index) => (
                        <tr key={donor.id}>
                            <td>{donor.id}</td>
                            <td>{donor.firstName}</td>
                            <td>{donor.lastName}</td>
                            <td>{donor.email}</td>
                            <td>
                                <button
                                    onClick={() =>
                                        handleViewDetailsClick(donor)
                                    }
                                >
                                    View More Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                className="modal-container"
            >
                <h2 className="modal-header">Details</h2>
                {donorDetails && (
                    <div>
                        <p>Donor ID: {donorDetails.id}</p>
                        <p>First Name: {donorDetails.firstName}</p>
                        <p>Last Name: {donorDetails.lastName}</p>
                        <p>Email: {donorDetails.email}</p>
                        <p>Contact Number: {donorDetails.contact}</p>
                        <p>Address Line 1: {donorDetails.addressLine1}</p>
                        <p>Address Line 2: {donorDetails.addressLine2}</p>
                        <p>City: {donorDetails.city}</p>
                        <p>State: {donorDetails.state}</p>
                        <p>Zipcode: {donorDetails.zipcode}</p>
                        <p>
                            Opted in for Emails:{' '}
                            {donorDetails.emailOptIn ? 'Yes' : 'No'}
                        </p>
                    </div>
                )}
                <div>
                    <button
                        className="edit-button"
                        onClick={() => handleEditDonorClick(donorDetails)}
                    >
                        Edit
                    </button>
                    <button
                        className="close-button"
                        onClick={() => setModalIsOpen(false)}
                    >
                        Close
                    </button>
                </div>
            </Modal>

            <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
                <button onClick={() => handleAddNewDonorClick()}>
                    <FaPlus size={24} />
                </button>
            </div>
        </div>
    );
};

export default DonorList;
