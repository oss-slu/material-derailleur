import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Button,
    TextField,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { SelectChangeEvent } from '@mui/material';

import '../css/DonatedItemDetails.css'; // Import the new CSS file

import { DonatedItem } from '../Modals/DonatedItemModal';

const DonatedItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [donatedItem, setDonatedItem] = useState<DonatedItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        itemType: '',
        dateDonated: '',
    }); // State to hold edited item details
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDonatedItemDetails = async () => {
            try {
                const API_BASE_URL =
                    process.env.REACT_APP_BACKEND_API_BASE_URL || '';
                const response = await axios.get<DonatedItem>(
                    `${API_BASE_URL}donatedItem/${id}`,
                    {
                        headers: {
                            Authorization: localStorage.getItem('token'),
                        },
                    },
                );
                const { itemType, dateDonated } = response.data;

                setDonatedItem(response.data);
                setEditData({
                    itemType,
                    dateDonated: new Date(dateDonated)
                        .toISOString()
                        .split('T')[0], // Format as YYYY-MM-DD
                });
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(
                        `Failed to fetch donated item details: ${err.response?.statusText || 'Server error'}`,
                    );
                } else {
                    setError('An unexpected error occurred');
                }
                console.error('Error fetching donated item:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDonatedItemDetails();
    }, [id]);

    // Toggle edit mode
    const toggleEditMode = () => {
        setIsEditing(!isEditing);
        // Reset edit data if canceling
        if (isEditing && donatedItem) {
            setEditData({
                itemType: donatedItem.itemType,
                dateDonated: donatedItem.dateDonated.toString().split('T')[0],
            });
        }
    };

    // Handle input changes in the edit form
    const handleInputChange = (
        e:
            | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | SelectChangeEvent<string>,
    ) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    // Save edited item details
    const saveEditedItem = async () => {
        if (!editData.itemType || !editData.dateDonated) {
            setError('All fields are required.');
            return;
        }
        try {
            setLoading(true);
            const API_BASE_URL =
                process.env.REACT_APP_BACKEND_API_BASE_URL || '';

            // Prepare payload with only the fields we want to update
            const payload = {
                itemType: editData.itemType,
                dateDonated: editData.dateDonated,
                currentStatus: donatedItem?.currentStatus,
                donorId: donatedItem?.donorId,
                programId: donatedItem?.programId,
            };

            const response = await axios.put(
                `${API_BASE_URL}donatedItem/details/${id}`,
                payload,
            );

            // Update local state with the response
            setDonatedItem({
                ...response.data.data,
                donor: donatedItem?.donor,
                program: donatedItem?.program,
                statuses: donatedItem?.statuses || [],
            });

            setIsEditing(false);
            setError('');
        } catch (err) {
            setError(
                'Failed to update item details. Please check the inputs and try again.',
            );
        } finally {
            setLoading(false);
        }
    };
    const formatDate = (dateString: string, isUTC: boolean) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        if (!isUTC)
            date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        return date.toDateString();
    };

    if (loading) return <div>Loading...</div>;
    if (error && !isEditing) return <div>Error: {error}</div>;
    if (!donatedItem) return <div>No data available.</div>;

    return (
        <div className="donated-item-details-container">
            <h1>Donated Item Details</h1>
            <div className="details-grid">
                {/* Left Column */}
                <div className="left-column">
                    {/* Vertical stepper implementation for donated item status */}
                    <section className="donated-item-status-section">
                        <div className="section-header">
                            <AssignmentTurnedInIcon className="icon" />
                            <h2>Donated Item Status</h2>
                            <button
                                onClick={() =>
                                    navigate(`/donatedItem/status/${id}`)
                                }
                            >
                                Add New Status
                            </button>
                        </div>
                        <Stepper orientation="vertical">
                            {donatedItem.statuses.map(status => (
                                <Step
                                    key={status.id}
                                    active={true}
                                    completed={false}
                                >
                                    <StepLabel>{`${status.statusType} (${formatDate(status.dateModified, false)})`}</StepLabel>

                                    <StepContent>
                                        <div className="image-scroll-container">
                                            {status.images.map((image, idx) => (
                                                <img
                                                    key={idx}
                                                    src={image}
                                                    alt={`Status Image ${idx}`}
                                                    className="status-image"
                                                />
                                            ))}
                                        </div>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    </section>
                </div>

                {/* Right Column */}
                <div className="right-column">
                    <section className="item-details-section">
                        <div className="section-header">
                            <CategoryIcon className="icon" />
                            <h2>Item Details</h2>
                            {/* Edit button to toggle edit mode */}
                            <Button
                                variant="contained"
                                onClick={toggleEditMode}
                                color={isEditing ? 'secondary' : 'primary'}
                            >
                                {isEditing ? 'Cancel' : 'Edit'}
                            </Button>
                        </div>
                        {isEditing ? (
                            // Edit form
                            <div className="edit-form">
                                {/* ✅ Show error message if it exists */}
                                {error && (
                                    <Alert
                                        severity="error"
                                        style={{ marginBottom: '1rem' }}
                                    >
                                        {error}
                                    </Alert>
                                )}
                                <TextField
                                    name="itemType"
                                    label="Item Type"
                                    value={editData.itemType}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />

                                <TextField
                                    name="dateDonated"
                                    label="Donated On"
                                    type="date"
                                    value={editData.dateDonated}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={saveEditedItem}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </div>
                        ) : (
                            // Display mode
                            <div className="view-mode">
                                <p>
                                    <strong>Type:</strong>{' '}
                                    {donatedItem.itemType}
                                </p>
                                <p>
                                    <strong>Status:</strong>{' '}
                                    {donatedItem.currentStatus}
                                </p>
                                <p>
                                    <strong>Donated On:</strong>{' '}
                                    {formatDate(donatedItem.dateDonated)}
                                </p>
                                <p>
                                    <strong>Last Updated:</strong>{' '}
                                    {formatDate(donatedItem.lastUpdated)}
                                </p>
                            </div>
                        )}
                    </section>

                    <section className="donor-details-section">
                        <div className="section-header">
                            <PersonIcon className="icon" />
                            <h2>Donor Details</h2>
                        </div>
                        <p>
                            <strong>Name:</strong> {donatedItem.donor.firstName}{' '}
                            {donatedItem.donor.lastName}
                        </p>
                        <p>
                            <strong>Email:</strong> {donatedItem.donor.email}
                        </p>
                        <p>
                            <strong>Contact:</strong>{' '}
                            {donatedItem.donor.contact}
                        </p>
                        <p>
                            <strong>Address:</strong>{' '}
                            {donatedItem.donor.addressLine1},{' '}
                            {donatedItem.donor.addressLine2 ?? ''}
                        </p>
                        <p>
                            <strong>City/State:</strong>{' '}
                            {donatedItem.donor.city}, {donatedItem.donor.state}{' '}
                            {donatedItem.donor.zipcode}
                        </p>
                    </section>

                    <section className="program-details-section">
                        <div className="section-header">
                            <EventNoteIcon className="icon" />
                            <h2>Program Details</h2>
                        </div>
                        <p>
                            <strong>Name:</strong> {donatedItem.program?.name}
                        </p>
                        <p>
                            <strong>Description:</strong>{' '}
                            {donatedItem.program?.description}
                        </p>
                        <p>
                            <strong>Start Date:</strong>{' '}
                            {formatDate(donatedItem.program?.startDate, false)}
                        </p>
                        <p>
                            <strong>Aim and Cause:</strong>{' '}
                            {donatedItem.program?.aimAndCause}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default DonatedItemDetails;
