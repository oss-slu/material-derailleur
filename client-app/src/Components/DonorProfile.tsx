import React, { useEffect, useState } from 'react';

interface Profile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipcode: string;
    emailOptIn: boolean;
    old?: string;
}

const DonorProfile = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Profile | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('You are not logged in.');
            setLoading(false);
            return;
        }

        fetch(`${process.env.REACT_APP_BACKEND_API_BASE_URL}donor/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async res => {
                if (!res.ok) throw new Error('Failed to fetch donor profile.');
                const data = await res.json();
                setProfile(data.profile);
                setEditForm({ ...data.profile }); // Pre-fill form
            })
            .catch(err => {
                console.error('Profile fetch error:', err);
                setError('Failed to load your data. Please try again.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Function: Navigate to Edit Donor Form
    const handleEditDonorClick = (donor: Profile | null) => {
        if (!donor) return;
        setEditForm({
            ...donor,
            old: donor.email, // capture before edits
        });
        setIsEditing(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}donor/edit`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editForm),
                },
            );
            if (!res.ok) throw new Error('Update failed');
            const updatedProfile = await res.json();
            setProfile(updatedProfile); // Update main state
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Update error:', err);
            alert('Something went wrong while updating your profile.');
        }
    };

    if (loading) return <p>Loading your dashboard...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!profile) return <p>No profile found.</p>;

    return (
        <div style={{ padding: '2rem', paddingTop: '4rem' }}>
            <h2>
                Welcome, {profile.firstName} {profile.lastName}
            </h2>

            <div
                style={{
                    maxWidth: '600px',
                    margin: 'auto',
                    padding: '2rem',
                    borderRadius: '10px',
                    background: '#f8f9fa',
                    marginTop: '2rem',
                }}
            >
                {!isEditing && editForm && (
                    <>
                        <h2>{profile.firstName} Details</h2>
                        <p>Donor ID: {profile.id}</p>
                        <p>First Name: {profile.firstName}</p>
                        <p>Last Name: {profile.lastName}</p>
                        <p>Email: {profile.email}</p>
                        <p>Contact Number: {profile.contact}</p>
                        <p>Address Line 1: {profile.addressLine1}</p>
                        <p>Address Line 2: {profile.addressLine2 || '-'}</p>
                        <p>City: {profile.city}</p>
                        <p>State: {profile.state}</p>
                        <p>Zipcode: {profile.zipcode}</p>
                        <p>
                            Opted in for Emails:{' '}
                            {profile.emailOptIn ? 'Yes' : 'No'}
                        </p>

                        <div style={{ marginTop: '1rem' }}>
                            <button
                                onClick={() => handleEditDonorClick(profile)}
                            >
                                Edit Details
                            </button>
                            <button
                                onClick={() => setModalIsOpen(false)}
                                style={{ marginLeft: '1rem' }}
                            >
                                Close
                            </button>
                        </div>
                    </>
                )}

                {isEditing && editForm && (
                    <>
                        <h2>Edit Profile</h2>
                        <form onSubmit={handleSave}>
                            <input
                                type="text"
                                value={editForm.firstName}
                                onChange={e =>
                                    setEditForm(prev =>
                                        prev
                                            ? {
                                                  ...prev,
                                                  firstName: e.target.value,
                                              }
                                            : prev,
                                    )
                                }
                                placeholder="First Name"
                            />
                            <input
                                type="text"
                                value={editForm.lastName}
                                onChange={e =>
                                    setEditForm(prev =>
                                        prev
                                            ? {
                                                  ...prev,
                                                  lastName: e.target.value,
                                              }
                                            : prev,
                                    )
                                }
                                placeholder="Last Name"
                            />
                            <input
                                type="text"
                                value={editForm.contact}
                                onChange={e =>
                                    setEditForm(prev =>
                                        prev
                                            ? {
                                                  ...prev,
                                                  contact: e.target.value,
                                              }
                                            : prev,
                                    )
                                }
                                placeholder="Contact Number"
                            />
                            <input
                                type="text"
                                value={editForm.addressLine1}
                                onChange={e =>
                                    setEditForm(prev =>
                                        prev
                                            ? {
                                                  ...prev,
                                                  addressLine1: e.target.value,
                                              }
                                            : prev,
                                    )
                                }
                                placeholder="Address Line 1"
                            />
                            <input
                                type="text"
                                value={editForm.addressLine2}
                                onChange={e =>
                                    setEditForm(prev =>
                                        prev
                                            ? {
                                                  ...prev,
                                                  addressLine2: e.target.value,
                                              }
                                            : prev,
                                    )
                                }
                                placeholder="Address Line 2"
                            />
                            <input
                                type="text"
                                value={editForm.city}
                                onChange={e =>
                                    setEditForm(prev =>
                                        prev
                                            ? { ...prev, city: e.target.value }
                                            : prev,
                                    )
                                }
                                placeholder="City"
                            />
                            <input
                                type="text"
                                value={editForm.state}
                                onChange={e =>
                                    setEditForm(prev =>
                                        prev
                                            ? { ...prev, state: e.target.value }
                                            : prev,
                                    )
                                }
                                placeholder="State"
                            />
                            <input
                                type="text"
                                value={editForm.zipcode}
                                onChange={e =>
                                    setEditForm(prev =>
                                        prev
                                            ? {
                                                  ...prev,
                                                  zipcode: e.target.value,
                                              }
                                            : prev,
                                    )
                                }
                                placeholder="Zipcode"
                            />
                            <button type="submit">Save</button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                style={{ marginLeft: '1rem' }}
                            >
                                Cancel
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default DonorProfile;
