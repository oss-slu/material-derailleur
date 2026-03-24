import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/AdminImageApproval.css'; // Import the new CSS file

import { DonatedItemStatus } from '../Modals/DonatedItemStatusModal';
import { DonatedItem } from '../Modals/DonatedItemModal';
import { stat } from 'fs';

const AdminImageApproval: React.FC = () => {
    const [donationStatuses, setDonationStatuses] = useState<
        DonatedItemStatus[]
    >([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const base = process.env.REACT_APP_BACKEND_API_BASE_URL || '/';

    useEffect(() => {
        const fetchStatuses = async () => {
            setLoading(true);
            try {
                // Database request to fetch pending statuses
                const res = await axios.get<DonatedItemStatus[]>(
                    `${base}donatedItem/status/review`,
                    {
                        headers: {
                            Authorization: localStorage.getItem('token'),
                        },
                    },
                );

                setDonationStatuses(res.data); // Store statuses in state
            } catch (err: any) {
                setError(err.message || 'Failed to load');
            } finally {
                setLoading(false);
            }
        };

        void fetchStatuses();
    }, [token, base]);

    // If the admin approves the update, mark item approved
    const handleApprove = async (id: number) => {
        try {
            const res = await fetch(`${base}donatedItem/status/review/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || res.statusText);
            }
            // refresh list
            setDonationStatuses(prev => prev.filter(u => u.id !== id));
        } catch (err: any) {
            setError(err.message || 'Update failed');
        }
    };

    // If the admin denies the status update, delete it
    const handleDeny = async (id: number) => {
        try {
            const res = await fetch(`${base}donatedItem/status/review/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || res.statusText);
            }
            // refresh list
            setDonationStatuses(prev => prev.filter(u => u.id !== id));
        } catch (err: any) {
            setError(err.message || 'Deny failed');
        }
    };

    const formatDate = (dateString: string, isUTC: boolean) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        if (!isUTC)
            date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        return date.toDateString();
    };

    if (loading) return <div>Loading users...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: 20, paddingTop: 80 }}>
            <h2>Status Approval</h2>
            {donationStatuses.length === 0 ? (
                <div>No statuses needing approval</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Donation ID</th>
                            <th>Status ID</th>
                            <th>Status</th>
                            <th>Submitter</th>
                            <th>Date Modified</th>
                            <th>Donor Informed</th>
                            <th>Images</th>
                            <th>Action</th>
                            <th>Visit Item</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donationStatuses.map(donationStatus => (
                            <tr key={donationStatus.id}>
                                <td>{donationStatus.donatedItemId ?? '—'}</td>
                                <td>{donationStatus.id ?? '—'}</td>
                                <td>{donationStatus.statusType ?? '—'}</td>
                                <td>{donationStatus.submitter ?? '—'}</td>
                                <td>
                                    {donationStatus.dateModified
                                        ? formatDate(
                                              donationStatus.dateModified,
                                              false,
                                          ).toString()
                                        : '—'}
                                </td>
                                <td>
                                    {donationStatus.donorInformed
                                        ? 'Yes'
                                        : 'No'}
                                </td>
                                <td>
                                    <div className="image-scroll-container">
                                        {donationStatus.images
                                            ? (donationStatus.images || []).map(
                                                  (image, idx) => (
                                                      <img
                                                          key={idx}
                                                          src={image}
                                                          alt={`Status Image ${idx}`}
                                                          className="status-image"
                                                      />
                                                  ),
                                              )
                                            : 'No images were provided'}
                                    </div>
                                </td>
                                <td>
                                    <button
                                        onClick={() =>
                                            handleApprove(donationStatus.id)
                                        }
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeny(donationStatus.id)
                                        }
                                    >
                                        Deny
                                    </button>
                                </td>
                                <td>
                                    {donationStatus.donatedItemId ? (
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/donations/${donationStatus.donatedItemId}`,
                                                )
                                            }
                                        >
                                            Visit
                                        </button>
                                    ) : (
                                        <div>Unavailable</div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminImageApproval;
