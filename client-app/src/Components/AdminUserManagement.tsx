import React, { useEffect, useState } from 'react';

type PendingUser = {
    id: string;
    name: string | null;
    email: string;
    role?: string | null;
    status?: string | null;
    createdAt: string;
};

const AdminUserManagement: React.FC = () => {
    const [users, setUsers] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>(
        {},
    );

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
        try {
            const role = selectedRoles[id] || 'DONOR';
            const status =
                selectedStatus[id] || selectedStatus[id] === ''
                    ? selectedStatus[id]
                    : undefined;
            const body: any = { role };
            if (status) body.status = status;

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

    if (loading) return <div>Loading users...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    // Options below should match prisma schema, update here if they are changed (or limit what admin can set)
    return (
        <div style={{ padding: 20, paddingTop: 80 }}>
            <h2>User Management</h2>
            {users.length === 0 ? (
                <div>No users found</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.name || '—'}</td>
                                <td>{u.email}</td>
                                <td>
                                    <select
                                        value={
                                            selectedRoles[u.id] ||
                                            u.role ||
                                            'DONOR'
                                        }
                                        onChange={e =>
                                            onRoleChange(u.id, e.target.value)
                                        }
                                    >
                                        <option value="DONOR">DONOR</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td>
                                    <select
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
                                        <option value="SUSPENDED">
                                            SUSPENDED
                                        </option>
                                    </select>
                                </td>
                                <td>
                                    {new Date(u.createdAt).toLocaleString()}
                                </td>
                                <td>
                                    <button onClick={() => updateUser(u.id)}>
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminUserManagement;
