import React, { useEffect, useState } from 'react';
import '../css/DonorProfile.css';

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
            const data = await res.json();
            const updatedProfile = data.profile ?? data;
            setProfile(prev =>
                prev
                    ? {
                          ...updatedProfile,
                          id: prev.id,
                      }
                    : updatedProfile,
            );
            setEditForm(prev =>
                prev
                    ? {
                          ...updatedProfile,
                          id: prev.id,
                          old: updatedProfile.email,
                      }
                    : updatedProfile,
            );
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
                        <h2>Profile Details</h2>
                        <p>
                            <b>Donor ID</b>: {profile.id}
                        </p>
                        <p>
                            <b>First Name</b>: {profile.firstName}
                        </p>
                        <p>
                            <b>Last Name</b>: {profile.lastName}
                        </p>
                        <p>
                            <b>Email</b>: {profile.email}
                        </p>
                        <p>
                            <b>Contact Number</b>: {profile.contact}
                        </p>
                        <p>
                            <b>Address Line 1</b>: {profile.addressLine1}
                        </p>
                        <p>
                            <b>Address Line 2</b>:{' '}
                            {profile.addressLine2 || 'N/A'}
                        </p>
                        <p>
                            <b>City</b>: {profile.city}
                        </p>
                        <p>
                            <b>State</b>: {profile.state}
                        </p>
                        <p>
                            <b>Zipcode</b>: {profile.zipcode}
                        </p>
                        <p>
                            <b>Opted in for Emails: </b>
                            {profile.emailOptIn ? 'Yes' : 'No'}
                        </p>

                        <div style={{ marginTop: '1rem' }}>
                            <button
                                onClick={() => handleEditDonorClick(profile)}
                            >
                                Edit Details
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
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
                        <form
                            onSubmit={handleSave}
                            className="form-grid-profile"
                        >
                            <div className="form-field">
                                <label>First Name</label>
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
                            </div>
                            <div className="form-field">
                                <label>Last Name</label>
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
                            </div>
                            <div className="form-field">
                                <label>Contact Number</label>
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
                            </div>
                            <div className="form-field">
                                <label>Address Line 1</label>
                                <input
                                    type="text"
                                    value={editForm.addressLine1}
                                    onChange={e =>
                                        setEditForm(prev =>
                                            prev
                                                ? {
                                                      ...prev,
                                                      addressLine1:
                                                          e.target.value,
                                                  }
                                                : prev,
                                        )
                                    }
                                    placeholder="Address Line 1"
                                />
                            </div>
                            <div className="form-field">
                                <label>Address Line 2</label>
                                <input
                                    type="text"
                                    value={editForm.addressLine2}
                                    onChange={e =>
                                        setEditForm(prev =>
                                            prev
                                                ? {
                                                      ...prev,
                                                      addressLine2:
                                                          e.target.value,
                                                  }
                                                : prev,
                                        )
                                    }
                                    placeholder="Address Line 2"
                                />
                            </div>
                            <div className="form-field">
                                <label>City</label>
                                <input
                                    type="text"
                                    value={editForm.city}
                                    onChange={e =>
                                        setEditForm(prev =>
                                            prev
                                                ? {
                                                      ...prev,
                                                      city: e.target.value,
                                                  }
                                                : prev,
                                        )
                                    }
                                    placeholder="City"
                                />
                            </div>
                            <div className="form-field">
                                <label>State</label>
                                <input
                                    type="text"
                                    value={editForm.state}
                                    onChange={e =>
                                        setEditForm(prev =>
                                            prev
                                                ? {
                                                      ...prev,
                                                      state: e.target.value,
                                                  }
                                                : prev,
                                        )
                                    }
                                    placeholder="State"
                                />
                            </div>
                            <div className="form-field">
                                <label>Zipcode</label>
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
                            </div>
                            <div>
                                <button type="submit">Save</button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    style={{ marginLeft: '1rem' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default DonorProfile;
