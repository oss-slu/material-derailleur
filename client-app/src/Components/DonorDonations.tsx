import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Stepper, Step, StepLabel, StepContent } from '@mui/material';
import { DonatedItemStatus } from 'Modals/DonatedItemStatusModal';
import { formatDate } from './DonatedItemDetails';

interface Donation {
    id: number;
    itemType: string;
    category: string;
    currentStatus: string;
    dateDonated: string;
    statuses: DonatedItemStatus[];
}

const DonorDonations = () => {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
        null,
    );
    const [donationModalIsOpen, setDonationModalIsOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) return;

        fetch(`${process.env.REACT_APP_BACKEND_API_BASE_URL}donor/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                setDonations(data.donations);
            })
            .catch(err => {
                console.error('Error fetching donations:', err);
            });
    }, []);

    const handleDonationClick = (donation: Donation) => {
        setSelectedDonation(donation);
        setDonationModalIsOpen(true);
    };

    return (
        <div style={{ padding: '2rem', paddingTop: '4rem' }}>
            <h2>Your Donations</h2>
            {donations.length === 0 ? (
                <p>You haven't made any donations yet.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th
                                style={{
                                    borderBottom: '1px solid #ccc',
                                    padding: '8px',
                                }}
                            >
                                ID
                            </th>
                            <th
                                style={{
                                    borderBottom: '1px solid #ccc',
                                    padding: '8px',
                                }}
                            >
                                Item Type
                            </th>
                            <th
                                style={{
                                    borderBottom: '1px solid #ccc',
                                    padding: '8px',
                                }}
                            >
                                Item Category
                            </th>
                            <th
                                style={{
                                    borderBottom: '1px solid #ccc',
                                    padding: '8px',
                                }}
                            >
                                Item Current Status
                            </th>
                            <th
                                style={{
                                    borderBottom: '1px solid #ccc',
                                    padding: '8px',
                                }}
                            >
                                Donated At
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map(donation => (
                            <tr
                                key={donation.id}
                                onClick={() => handleDonationClick(donation)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: '#f9f9f9',
                                }}
                            >
                                <td style={{ padding: '8px' }}>
                                    {donation.id}
                                </td>
                                <td style={{ padding: '8px' }}>
                                    {donation.itemType}
                                </td>
                                <td style={{ padding: '8px' }}>
                                    {donation.category}
                                </td>
                                <td style={{ padding: '8px' }}>
                                    {donation.currentStatus}
                                </td>
                                <td style={{ padding: '8px' }}>
                                    {new Date(
                                        donation.dateDonated,
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Modal
                isOpen={donationModalIsOpen}
                onRequestClose={() => setDonationModalIsOpen(false)}
                contentLabel="Donation Details"
                style={{
                    content: {
                        maxWidth: '500px',
                        margin: 'auto',
                        padding: '2rem',
                        borderRadius: '10px',
                    },
                }}
            >
                <h2>Donation Details</h2>
                {selectedDonation && (
                    <>
                        <p>
                            <strong>ID:</strong> {selectedDonation.id}
                        </p>
                        <p>
                            <strong>Item:</strong> {selectedDonation.itemType}
                        </p>
                        <p>
                            <strong>Date:</strong>{' '}
                            {new Date(
                                selectedDonation.dateDonated,
                            ).toLocaleString()}
                        </p>
                        <button
                            onClick={() => setDonationModalIsOpen(false)}
                            style={{ marginTop: '1rem' }}
                        >
                            Close
                        </button>
                        <hr></hr>
                        <h3>Item History</h3>
                        <Stepper orientation="vertical">
                            {selectedDonation?.statuses?.map(status =>
                                status.approval ? (
                                    // If approved
                                    <Step
                                        key={status.id}
                                        active={true}
                                        completed={false}
                                    >
                                        <StepLabel>{`${status.statusType} (${formatDate(
                                            status.dateModified,
                                            false,
                                        )})`}</StepLabel>

                                        <StepContent>
                                            <div className="image-scroll-container">
                                                {(status.images ?? []).map(
                                                    (image, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={image}
                                                            alt={`Status ${idx}`}
                                                            className="status-image"
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </StepContent>
                                    </Step>
                                ) : (
                                    // If not approved
                                    <Step
                                        key={status.id}
                                        active={true}
                                        completed={false}
                                    >
                                        <StepLabel>{`${status.statusType} (${formatDate(status.dateModified, false)}) (Pending)`}</StepLabel>
                                    </Step>
                                ),
                            )}
                        </Stepper>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default DonorDonations;
