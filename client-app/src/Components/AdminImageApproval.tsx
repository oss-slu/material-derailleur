import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/AdminImageApproval.css';

import { DonatedItemStatus } from '../Modals/DonatedItemStatusModal';

const AdminImageApproval: React.FC = () => {
    const [donationStatuses, setDonationStatuses] = useState<
        DonatedItemStatus[]
    >([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [approvingAll, setApprovingAll] = useState<boolean>(false);
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

    const handleApproveAll = async () => {
        if (donationStatuses.length === 0 || approvingAll) return;

        setApprovingAll(true);
        setError(null);

        try {
            for (const donationStatus of donationStatuses) {
                const res = await fetch(
                    `${base}donatedItem/status/review/${donationStatus.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            Authorization: token ? `Bearer ${token}` : '',
                            'Content-Type': 'application/json',
                        },
                    },
                );

                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(txt || res.statusText);
                }
            }

            setDonationStatuses([]);
        } catch (err: any) {
            setError(err.message || 'Approve all failed');
        } finally {
            setApprovingAll(false);
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
                <>
                    <div style={{ marginBottom: 16 }}>
                        <button
                            onClick={handleApproveAll}
                            disabled={approvingAll}
                        >
                            {approvingAll ? 'Approving...' : 'Approve all'}
                        </button>
                    </div>
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
                                    <td>{donationStatus.donatedItemId ?? '-'}</td>
                                    <td>{donationStatus.id ?? '-'}</td>
                                    <td>{donationStatus.statusType ?? '-'}</td>
                                    <td>{donationStatus.submitter ?? '-'}</td>
                                    <td>
                                        {donationStatus.dateModified
                                            ? formatDate(
                                                  donationStatus.dateModified,
                                                  false,
                                              ).toString()
                                            : '-'}
                                    </td>
                                    <td>
                                        {donationStatus.donorInformed
                                            ? 'Yes'
                                            : 'No'}
                                    </td>
                                    <td>
                                        <div className="image-scroll-container">
                                            {donationStatus.images.length > 0
                                                ? (
                                                      donationStatus.images || []
                                                  ).map((image, idx) => (
                                                      <img
                                                          key={idx}
                                                          src={image}
                                                          alt={`Status ${idx}`}
                                                          className="status-image"
                                                      />
                                                  ))
                                                : 'No images were provided'}
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleApprove(donationStatus.id)
                                            }
                                            disabled={approvingAll}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeny(donationStatus.id)
                                            }
                                            disabled={approvingAll}
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
                                                disabled={approvingAll}
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
                </>
            )}
        </div>
    );
};

export default AdminImageApproval;
