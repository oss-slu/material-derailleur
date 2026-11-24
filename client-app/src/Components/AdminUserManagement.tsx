import React, { useEffect, useState } from 'react';
import '../css/AdminUserManagement.css';

type PendingUser = {
    id: string;
    name: string | null;
    email: string;
    role?: string | null;
    status?: string | null;
    createdAt: string;
    hasDonorProfile: boolean;
};

const AdminUserManagement: React.FC = () => {
    const [users, setUsers] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>(
        {},
    );
    const [donorDetails, setDonorDetails] = useState<
        Record<
            string,
            {
                firstName: string;
                lastName: string;
                zipcode: string;
            }
        >
    >({});

    const token = localStorage.getItem('token');
    const base = process.env.REACT_APP_BACKEND_API_BASE_URL || '/';

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                // Database request to fetch users
                const res = await fetch(`${base}donor/users`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                    },
                });
                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(txt || res.statusText);
                }
                const data = await res.json(); // Parse response into JSON
                setUsers(data || []); // Store users in state
                // set default selected roles/status to existing values
                const defaults: Record<string, string> = {};
                (data || []).forEach((u: any) => {
                    defaults[u.id] = u.role || 'DONOR';
                });
                setSelectedRoles(defaults);
            } catch (err: any) {
                setError(err.message || 'Failed to load');
            } finally {
                setLoading(false);
            }
        };

        void fetchUsers();
    }, [token, base]);

    const updateUser = async (id: string) => {
        setError(null);
        try {
            const role = selectedRoles[id] || 'DONOR';
            const status =
                selectedStatus[id] || selectedStatus[id] === ''
                    ? selectedStatus[id]
                    : undefined;
            const body: any = { role };
            if (status) body.status = status;

            const user = users.find(u => u.id === id);

            if (role === 'DONOR' && user && !user.hasDonorProfile) {
                const details = donorDetails[id];

                if (
                    !details?.firstName.trim() ||
                    !details?.lastName.trim() ||
                    !details?.zipcode.trim()
                ) {
                    setError('Please fill in the donor name and ZIP code.');
                    return;
                }

                body.donorDetails = {
                    firstName: details.firstName.trim(),
                    lastName: details.lastName.trim(),
                    zipcode: details.zipcode.trim(),
                };
            }

            const res = await fetch(
                `${base}donor/users/${encodeURIComponent(id)}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                },
            );
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || res.statusText);
            }
            // refresh list
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err: any) {
            setError(err.message || 'Update failed');
        }
    };

    const [selectedStatus, setSelectedStatus] = useState<
        Record<string, string>
    >({});

    const onStatusChange = (id: string, value: string) => {
        setSelectedStatus(prev => ({ ...prev, [id]: value }));
    };

    const onRoleChange = (id: string, value: string) => {
        setSelectedRoles(prev => ({ ...prev, [id]: value }));
    };

    const onDonorDetailsChange = (
        id: string,
        field: 'firstName' | 'lastName' | 'zipcode',
        value: string,
    ) => {
        setDonorDetails(prev => ({
            ...prev,
            [id]: {
                firstName: prev[id]?.firstName ?? '',
                lastName: prev[id]?.lastName ?? '',
                zipcode: prev[id]?.zipcode ?? '',
                [field]: value,
            },
        }));
    };

    if (loading) return <div>Loading users...</div>;

    // Options below should match prisma schema, update here if they are changed (or limit what admin can set)
    return (
        <div className="um-page">
            <div className="um-header">
                <h1 className="um-title">User Management</h1>
                <span className="um-count">{users.length} users</span>
            </div>

            {error && (
                <div role="alert" className="um-error">
                    {error}
                </div>
            )}

            {users.length === 0 ? (
                <div className="um-empty">No users found</div>
            ) : (
                <>
                    <div className="um-columns">
                        <span>User</span>
                        <span>Role</span>
                        <span>Status</span>
                        <span>Created</span>
                        <span>Action</span>
                    </div>

                    {users.map(u => (
                        <div
                            className="um-card"
                            data-status={u.status || 'PENDING'}
                            key={u.id}
                        >
                            {/* Column 1: avatar, name, email */}
                            <div className="um-user">
                                <div className="um-avatar">
                                    {(u.name || u.email || '?')
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                                <div>
                                    <div className="um-name">
                                        {u.name || '—'}
                                    </div>
                                    <div className="um-email">{u.email}</div>
                                </div>
                            </div>

                            {/* Column 2: role */}
                            <select
                                className="um-select"
                                value={selectedRoles[u.id] || u.role || 'DONOR'}
                                onChange={e =>
                                    onRoleChange(u.id, e.target.value)
                                }
                            >
                                <option value="DONOR">DONOR</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="TIER_ONE">TIER_ONE</option>
                                <option value="TIER_TWO">TIER_TWO</option>
                                <option value="TIER_THREE">TIER_THREE</option>
                            </select>

                            {/* Column 3: status */}
                            <select
                                className="um-select"
                                value={
                                    selectedStatus[u.id] ??
                                    (u.status || 'PENDING')
                                }
                                onChange={e =>
                                    onStatusChange(u.id, e.target.value)
                                }
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="SUSPENDED">SUSPENDED</option>
                            </select>

                            {/* Column 4: created */}
                            <div className="um-date">
                                {new Date(u.createdAt).toLocaleString()}
                            </div>

                            {/* Column 5: action */}
                            <button
                                className="um-update"
                                onClick={() => updateUser(u.id)}
                            >
                                Update
                            </button>

                            {/* Full-width row, only for new DONOR users */}
                            {selectedRoles[u.id] === 'DONOR' &&
                                !u.hasDonorProfile && (
                                    <div className="um-donor">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            value={
                                                donorDetails[u.id]?.firstName ||
                                                ''
                                            }
                                            onChange={e =>
                                                onDonorDetailsChange(
                                                    u.id,
                                                    'firstName',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            value={
                                                donorDetails[u.id]?.lastName ||
                                                ''
                                            }
                                            onChange={e =>
                                                onDonorDetailsChange(
                                                    u.id,
                                                    'lastName',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="ZIP Code"
                                            value={
                                                donorDetails[u.id]?.zipcode ||
                                                ''
                                            }
                                            onChange={e =>
                                                onDonorDetailsChange(
                                                    u.id,
                                                    'zipcode',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                )}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default AdminUserManagement;
