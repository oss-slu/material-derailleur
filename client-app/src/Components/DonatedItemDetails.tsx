import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Stepper, Step, StepLabel, StepContent, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import '../css/DonatedItemDetails.css'; // Import the new CSS file
import { Donor } from '../Modals/DonorModal';
import { Program } from '../Modals/ProgramModal';
import { DonatedItemStatus } from '../Modals/DonatedItemStatusModal';
import { DonatedItem } from '../Modals/DonatedItemModal';
import BarcodeDisplay from './BarcodeDisplay'; // added import
import Barcode from 'react-barcode'; // add import near top

const DonatedItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [donatedItem, setDonatedItem] = useState<DonatedItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleAddNewDonationClick = (): void => {
        navigate(`/donatedItem/status/${id}`);
    };

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

                setDonatedItem(response.data);
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

    const formatDate = (dateString: string, isUTC: boolean) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        if (!isUTC)
            date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        return date.toDateString();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!donatedItem) return <div>No data available.</div>;

    // compute a reliable id to use for barcode (common id fields)
    const barcodeId =
        (donatedItem as any).id ||
        (donatedItem as any)._id ||
        (donatedItem as any).donatedItemId ||
        id ||
        '';

    // helper functions for download/print inside this component
    const downloadDetailSvg = () => {
        if (!barcodeId) return;
        const svgEl = document.querySelector<SVGElement>(`#barcode-detail-${barcodeId} svg`);
        if (!svgEl) {
            console.error('SVG element not found in detail view');
            return;
        }
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgEl);
        if (!svgString.startsWith('<?xml')) {
            svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;
        }
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `barcode-${barcodeId}.svg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const printDetail = () => {
        if (!barcodeId) return;
        const svgEl = document.querySelector<SVGElement>(`#barcode-detail-${barcodeId} svg`);
        if (!svgEl) {
            console.error('SVG element not found for printing');
            return;
        }
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgEl);

        // Ensure xmlns present
        if (!/xmlns=/.test(svgString)) {
            svgString = svgString.replace(
                /^<svg/,
                '<svg xmlns="http://www.w3.org/2000/svg"'
            );
        }

        const printHtml = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Print Barcode</title>
<style>
  html,body{height:100%;margin:0;padding:0;}
  body{display:flex;align-items:center;justify-content:center;background:#fff;}
  svg{max-width:95%;height:auto;display:block;}
</style>
</head>
<body>
${svgString}
<script>
  window.onload = function(){
    setTimeout(function(){ window.print(); window.onafterprint = function(){ window.close(); }; }, 200);
  };
</script>
</body>
</html>`;

        const w = window.open('', '_blank', 'noopener,noreferrer');
        if (!w) return;
        w.document.open();
        w.document.write(printHtml);
        w.document.close();
    };

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
                        </div>
                        <p>
                            <strong>Type:</strong> {donatedItem.itemType}
                        </p>
                        <p>
                            <strong>Status:</strong> {donatedItem.currentStatus}
                        </p>
                        <p>
                            <strong>Donated On:</strong>{' '}
                            {formatDate(donatedItem.dateDonated, false)}
                        </p>
                        <p>
                            <strong>Last Updated:</strong>{' '}
                            {formatDate(donatedItem.lastUpdated, true)}
                        </p>
                    </section>

                    <section
                        className="barcode-section"
                        style={{ marginTop: 16 }}
                    >
                        <div className="section-header">
                            <CategoryIcon className="icon" />
                            <h2>Barcode / Label</h2>
                        </div>

                        <div className="barcode-content">
                            {barcodeId ? (
                                <>
                                    <div id={`barcode-detail-${barcodeId}`}>
                                        <Barcode value={String(barcodeId)} format="CODE128" />
                                    </div>
                                    <div style={{ marginTop: 8 }}>
                                        <button type="button" onClick={downloadDetailSvg}>Download SVG</button>
                                        <button type="button" style={{ marginLeft: 8 }} onClick={printDetail}>Print</button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ color: '#666', fontSize: 13 }}>
                                    No barcode id available for this item.
                                </div>
                            )}
                            <p>
                                Download or print this barcode for inventory
                                labels.
                            </p>
                        </div>
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
