import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../css/AdminHeader.css';
import '../css/DonatedItemsList.css';
import html2canvas from 'html2canvas';
import Barcode from 'react-barcode';
import { Program } from '../Modals/ProgramModal';
import { DonatedItem } from '../Modals/DonatedItemModal';
import { DonatedItemStatus as Status } from '../Modals/DonatedItemStatusModal';
import axios from 'axios';

interface SelectedItemDetails extends DonatedItem {
    statuses: Status[];
}

const DonatedItemsList: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<DonatedItem[]>([]);
    const [selectedItemDetails, setSelectedItemDetails] =
        useState<SelectedItemDetails | null>(null);

    const [donatedItems, setDonatedItems] = useState<DonatedItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [programOptions, setProgramOptions] = useState<Program[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [itemTypes, setItemTypes] = useState<Set<string>>(new Set());

    const navigate = useNavigate();

    const fetchDonatedItems = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await axios.get<DonatedItem[]>(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}donatedItem`,
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                },
            );
            setDonatedItems(response.data);
            setLoading(false);
        } catch (err) {
            const error = err as Error;
            console.error('Error details:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchProgramOptions = async (): Promise<void> => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}program`,
            );
            if (!response.ok) {
                throw new Error('Failed to fetch program options');
            }
            const data: Program[] = await response.json();
            setProgramOptions(data);
        } catch (err) {
            const error = err as Error;
            console.error('Error fetching program options:', error);
        }
    };

    useEffect(() => {
        fetchDonatedItems();
        fetchProgramOptions();
    }, []);

    useEffect(() => {
        const types = new Set(donatedItems.map(item => item.itemType));
        setItemTypes(types);
    }, [donatedItems]);

    const handleSearch = (): void => {
        const searchTerm = searchInput.toLowerCase();
        const filtered = donatedItems.filter(
            item =>
                item.id.toString().includes(searchTerm) ||
                item.itemType.toLowerCase().includes(searchTerm) ||
                item.donor?.firstName.toLowerCase().includes(searchTerm),
        );
        setFilteredItems(filtered);
    };
    const handleSort = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const value = event.target.value;
        const sorted = [...donatedItems].sort((a, b) => {
            const dateA = new Date(a.dateDonated);
            const dateB = new Date(b.dateDonated);

            if (value === 'dateAsc') {
                return dateA.getTime() - dateB.getTime();
            } else if (value === 'dateDesc') {
                return dateB.getTime() - dateA.getTime();
            }
            return 0;
        });
        setFilteredItems(sorted);
    };

    const handleBarcodeClick = (itemId: number): void => {
        const selectedItem = donatedItems.find(item => item.id === itemId);
        if (selectedItem) {
            setSelectedItemDetails({
                ...selectedItem,
                statuses: selectedItem.statuses || [],
            });
        }
        setModalIsOpen(true);
    };

    const handleFilterByItemName = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ): void => {
        if (!event.target.value) {
            setFilteredItems([]);
            return;
        }
        const filtered = donatedItems.filter(
            item =>
                item.itemType.toLowerCase() ===
                event.target.value.toLowerCase(),
        );
        setFilteredItems(filtered);
    };

    const handleFilterByProgram = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ): void => {
        if (!event.target.value) {
            setFilteredItems([]);
            return;
        }
        const programId = parseInt(event.target.value);
        const filtered = donatedItems.filter(
            item => item.programId === programId,
        );
        setFilteredItems(filtered);
    };

    const handleFilterByStatus = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ): void => {
        if (!event.target.value) {
            setFilteredItems([]);
            return;
        }
        const filtered = donatedItems.filter(
            item =>
                item.currentStatus.toLowerCase() ===
                event.target.value.toLowerCase(),
        );
        setFilteredItems(filtered);
    };

    const handleAddNewDonationClick = (): void => {
        navigate('/adddonation');
    };

    const downloadBarcode = (id: number) => {
        // find the svg element rendered by react-barcode
        const svgEl = document.querySelector<SVGElement>(`#barcode-${id} svg`);
        if (svgEl) {
            const serializer = new XMLSerializer();
            let svgString = serializer.serializeToString(svgEl);
            // ensure xml prolog and namespaces for standalone SVG files
            if (!svgString.startsWith('<?xml')) {
                svgString =
                    '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;
            }
            const blob = new Blob([svgString], {
                type: 'image/svg+xml;charset=utf-8',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `barcode-${id}.svg`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            return;
        }
        // fallback to previous PNG behavior if SVG not found
        const barcodeElement = document.getElementById(`barcode-${id}`);
        if (barcodeElement) {
            html2canvas(barcodeElement)
                .then(canvas => {
                    const image = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = image;
                    link.download = `barcode-${id}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch(err =>
                    console.error('Error downloading the barcode: ', err),
                );
        } else {
            console.error('Barcode element not found');
        }
    };

    const printBarcode = (id: number) => {
        const svgEl = document.querySelector<SVGElement>(`#barcode-${id} svg`);
        if (svgEl) {
            const serializer = new XMLSerializer();
            let svgString = serializer.serializeToString(svgEl);

            // Ensure xmlns is present (some renderers omit it)
            if (!/xmlns=/.test(svgString)) {
                svgString = svgString.replace(
                    /^<svg/,
                    '<svg xmlns="http://www.w3.org/2000/svg"',
                );
            }

            // Build full HTML for print with charset and basic styling
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
  // allow render to settle before printing
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
            return;
        }

        // fallback: try printing as image via html2canvas
        const el = document.getElementById(`barcode-${id}`);
        if (el) {
            html2canvas(el).then(canvas => {
                const dataUrl = canvas.toDataURL();
                const w = window.open('', '_blank', 'noopener,noreferrer');
                if (!w) return;
                w.document.write(`
                    <!doctype html><html><head><title>Print Barcode</title></head>
                    <body style="margin:0;display:flex;align-items:center;justify-content:center">
                    <img src="${dataUrl}" onload="window.print();window.onafterprint=function(){window.close();}" />
                    </body></html>`);
                w.document.close();
            });
        } else {
            console.error('Barcode element not found for print');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="donated-page">
            {/* New page header: title left, tools right */}
            <header className="page-header">
                <h1 className="page-title">Donated Items</h1>
            </header>

            <div className="toolbar">
                <div className="search-wrap">
                    <form
                        className="search-bar"
                        onSubmit={e => {
                            e.preventDefault();
                            handleSearch();
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Search using Item Id, Name, or Donor"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                        <button
                            className="btn btn-primary search-button"
                            type="submit"
                        >
                            🔍
                        </button>
                    </form>
                </div>

                <button
                    className="btn btn-primary add-btn"
                    onClick={handleAddNewDonationClick}
                >
                    + Add Donation
                </button>
            </div>

            {/* Filters under the header */}
            <div className="dropdowns">
                <select
                    className="sort-options"
                    onChange={handleSort}
                    defaultValue=""
                >
                    <option value="" disabled>
                        Sort
                    </option>
                    <option value="dateAsc">Date Ascending</option>
                    <option value="dateDesc">Date Descending</option>
                </select>

                <select
                    className="filter-options"
                    onChange={handleFilterByItemName}
                    defaultValue=""
                >
                    <option value="" disabled>
                        Filter by Item Type
                    </option>
                    {Array.from(itemTypes).map(type => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>

                <select
                    className="filter-options"
                    onChange={handleFilterByProgram}
                    defaultValue=""
                >
                    <option value="" disabled>
                        Filter by Program
                    </option>
                    {programOptions.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>

                <select
                    className="filter-options"
                    onChange={handleFilterByStatus}
                    defaultValue=""
                >
                    <option value="" disabled>
                        Filter by Status
                    </option>
                    <option value="RECEIVED">Received</option>
                </select>
            </div>

            {/* Table (unchanged) */}
            <table className="item-list">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Status</th>
                        <th>Donation Date</th>
                        <th>Barcode</th>
                    </tr>
                </thead>
                <tbody>
                    {(filteredItems.length > 0
                        ? filteredItems
                        : donatedItems
                    ).map((item, index) => (
                        <tr
                            key={item.id}
                            className="clickable-row"
                            onClick={() => navigate(`/donations/${item.id}`)}
                        >
                            <td>{index + 1}</td>
                            <td>{item.id}</td>
                            <td>{item.itemType}</td>
                            <td>{item.currentStatus}</td>
                            <td>
                                {new Date(item.dateDonated).toLocaleDateString(
                                    undefined,
                                    { timeZone: 'UTC' },
                                )}
                            </td>
                            <td>
                                <div>
                                    <div id={`barcode-${item.id}`}>
                                        <Barcode
                                            value={item.id.toString()}
                                            format="CODE128"
                                        />
                                    </div>
                                    <div style={{ marginTop: 6 }}>
                                        <button
                                            className="btn btn-link"
                                            onClick={e => {
                                                e.stopPropagation();
                                                downloadBarcode(item.id);
                                            }}
                                            type="button"
                                        >
                                            Download SVG
                                        </button>
                                        <button
                                            className="btn btn-link"
                                            onClick={e => {
                                                e.stopPropagation();
                                                printBarcode(item.id);
                                            }}
                                            type="button"
                                            style={{ marginLeft: 8 }}
                                        >
                                            Print
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal (unchanged) */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
            >
                <h2>Item Details</h2>
                {selectedItemDetails && (
                    <div>
                        <p>Item ID: {selectedItemDetails.id}</p>
                        <p>Item Type: {selectedItemDetails.itemType}</p>
                        <p>
                            Current Status: {selectedItemDetails.currentStatus}
                        </p>
                        <p>
                            Date Donated:{' '}
                            {new Date(
                                selectedItemDetails.dateDonated,
                            ).toLocaleDateString(undefined, {
                                timeZone: 'UTC',
                            })}
                        </p>
                        {selectedItemDetails.lastUpdated && (
                            <p>
                                Last Updated:{' '}
                                {new Date(
                                    selectedItemDetails.lastUpdated,
                                ).toLocaleDateString(undefined, {
                                    timeZone: 'UTC',
                                })}
                            </p>
                        )}
                        <p>
                            Donor Name:{' '}
                            {selectedItemDetails.donor
                                ? selectedItemDetails.donor.firstName
                                : 'N/A'}
                        </p>
                        <p>
                            Program:{' '}
                            {selectedItemDetails.program
                                ? selectedItemDetails.program.name
                                : 'Not Assigned'}
                        </p>

                        {!!selectedItemDetails.statuses?.length && (
                            <>
                                <h3>Status History</h3>
                                <ul>
                                    {selectedItemDetails.statuses.map(
                                        (s, i) => (
                                            <li key={i}>
                                                {s.statusType} —{' '}
                                                {new Date(
                                                    s.dateModified,
                                                ).toLocaleDateString(
                                                    undefined,
                                                    { timeZone: 'UTC' },
                                                )}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </>
                        )}
                    </div>
                )}
                <button onClick={() => setModalIsOpen(false)}>Close</button>
            </Modal>
        </div>
    );
};

export default DonatedItemsList;
