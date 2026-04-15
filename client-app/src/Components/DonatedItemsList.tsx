import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../css/AdminHeader.css';
import '../css/DonatedItemsList.css';
import html2canvas from 'html2canvas';
import Barcode from 'react-barcode';
import { Program } from '../Modals/ProgramModal';
import { DonatedItem, ItemAttribute } from '../Modals/DonatedItemModal';
import { DonatedItemStatus as Status } from '../Modals/DonatedItemStatusModal';
import axios from 'axios';
import { Result, useZxing } from 'react-zxing';
import {
    type AttributeDefinition,
    type AttributeValueType,
    getAllDefaultAttributeDefinitions,
    normalizeDescriptor,
} from '../constants/attributeDefinitions';

interface SelectedItemDetails extends DonatedItem {
    statuses: Status[];
}

type BooleanFilterValue = '' | 'true' | 'false';

interface AttributeFilter {
    descriptor: string;
    valueType: AttributeValueType;
    textValue: string;
    minValue: string;
    maxValue: string;
    booleanValue: BooleanFilterValue;
}

const normalize = normalizeDescriptor;

const isAttributeDefinition = (
    value: AttributeDefinition | null,
): value is AttributeDefinition => value !== null;

const formatAttributeValue = (attribute: ItemAttribute) => {
    if (attribute.stringValue !== null) return attribute.stringValue;
    if (attribute.numberValue !== null) return String(attribute.numberValue);
    if (attribute.booleanValue !== null)
        return attribute.booleanValue ? 'yes' : 'no';
    return '';
};

const DonatedItemsList: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [sortValue, setSortValue] = useState<string>('');
    const [itemTypeFilter, setItemTypeFilter] = useState<string>('');
    const [programFilter, setProgramFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [advancedSearchOpen, setAdvancedSearchOpen] =
        useState<boolean>(false);
    const [selectedAttributeDescriptor, setSelectedAttributeDescriptor] =
        useState<string>('');
    const [attributeFilters, setAttributeFilters] = useState<AttributeFilter[]>(
        [],
    );
    const [scanning, setScanning] = useState(false);
    const [filteredItems, setFilteredItems] = useState<DonatedItem[]>([]);
    const [selectedItemDetails, setSelectedItemDetails] =
        useState<SelectedItemDetails | null>(null);

    const [donatedItems, setDonatedItems] = useState<DonatedItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [programOptions, setProgramOptions] = useState<Program[]>([]);
    const [attributeOptions, setAttributeOptions] = useState<
        AttributeDefinition[]
    >(getAllDefaultAttributeDefinitions());
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [itemTypes, setItemTypes] = useState<Set<string>>(new Set());

    const navigate = useNavigate();

    const getAttributeDefinition = (descriptor: string) =>
        attributeOptions.find(
            option => normalize(option.descriptor) === normalize(descriptor),
        );

    const isSecure = () =>
        typeof window !== 'undefined' && window.isSecureContext;

    const handleBeginScan = async () => {
        setError(null);

        // Require HTTPS. Don’t start scanning on HTTP.
        if (!isSecure()) {
            setError('Scanning requires HTTPS. Please open the secure site.');
            return;
        }

        // Try permission to prevent uncaught error
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: 'environment' } },
                audio: false,
            });
            stream.getTracks().forEach(t => t.stop());
            setScanning(true);
        } catch (err) {
            setError(explainMediaError(err));
        }
    };

    const explainMediaError = (err: unknown) => {
        const e = err as DOMException & { name?: string; message?: string };
        if (!isSecure())
            return 'Scanning requires HTTPS. Please open the secure site.';
        if (e?.name === 'NotAllowedError')
            return 'Camera permission denied. Allow access and try again.';
        if (e?.name === 'NotFoundError') return 'No camera device found.';
        if (e?.name === 'NotReadableError')
            return 'Camera is busy or not readable.';
        if (e?.name === 'SecurityError')
            return 'Camera blocked by browser security policy.';
        return e?.message || 'Camera error. Please try again.';
    };

    const { ref } = useZxing({
        constraints: { video: { facingMode: 'environment' } },
        onDecodeResult(result: Result) {
            setSearchInput(result.getText());
            setScanning(false);
            setError(null);
            handleSearch(result.getText());
        },
        onError(err: unknown) {
            setError(err instanceof Error ? err.message : 'Scanner error');
        },
        paused: !scanning,
    });

    const applyFilters = (searchTermOverride?: string) => {
        const searchTerm = normalize(searchTermOverride ?? searchInput);

        let nextItems = donatedItems.filter(item => {
            const donorName = `${item.donor?.firstName || ''} ${
                item.donor?.lastName || ''
            }`;

            const attributeMatchesSearch = (item.attributes || []).some(
                attribute =>
                    normalize(attribute.descriptor).includes(searchTerm) ||
                    normalize(formatAttributeValue(attribute)).includes(
                        searchTerm,
                    ),
            );

            const matchesSearch =
                !searchTerm ||
                item.id.toString().includes(searchTerm) ||
                normalize(item.itemType).includes(searchTerm) ||
                normalize(item.category).includes(searchTerm) ||
                normalize(item.currentStatus).includes(searchTerm) ||
                normalize(donorName).includes(searchTerm) ||
                normalize(item.program?.name).includes(searchTerm) ||
                attributeMatchesSearch;

            const matchesItemType =
                !itemTypeFilter ||
                normalize(item.itemType) === normalize(itemTypeFilter);

            const matchesProgram =
                !programFilter || item.programId === Number(programFilter);

            const matchesStatus =
                !statusFilter ||
                normalize(item.currentStatus) === normalize(statusFilter);

            const itemDate = new Date(item.dateDonated).getTime();
            const minDate = dateFrom
                ? new Date(`${dateFrom}T00:00:00`).getTime()
                : null;
            const maxDate = dateTo
                ? new Date(`${dateTo}T23:59:59`).getTime()
                : null;
            const matchesDateFrom = minDate === null || itemDate >= minDate;
            const matchesDateTo = maxDate === null || itemDate <= maxDate;

            const matchesAttributes = attributeFilters.every(filter => {
                const matchingAttributes = (item.attributes || []).filter(
                    attribute =>
                        normalize(attribute.descriptor) ===
                        normalize(filter.descriptor),
                );

                if (matchingAttributes.length === 0) {
                    return false;
                }

                return matchingAttributes.some(attribute => {
                    if (filter.valueType === 'boolean') {
                        if (!filter.booleanValue) return true;
                        return (
                            String(attribute.booleanValue) ===
                            filter.booleanValue
                        );
                    }

                    if (filter.valueType === 'number') {
                        if (attribute.numberValue === null) return false;
                        const matchesMin =
                            !filter.minValue ||
                            attribute.numberValue >= Number(filter.minValue);
                        const matchesMax =
                            !filter.maxValue ||
                            attribute.numberValue <= Number(filter.maxValue);
                        return matchesMin && matchesMax;
                    }

                    return (
                        !filter.textValue ||
                        normalize(attribute.stringValue).includes(
                            normalize(filter.textValue),
                        )
                    );
                });
            });

            return (
                matchesSearch &&
                matchesItemType &&
                matchesProgram &&
                matchesStatus &&
                matchesDateFrom &&
                matchesDateTo &&
                matchesAttributes
            );
        });

        if (sortValue) {
            nextItems = [...nextItems].sort((a, b) => {
                const dateA = new Date(a.dateDonated).getTime();
                const dateB = new Date(b.dateDonated).getTime();

                if (sortValue === 'dateAsc') {
                    return dateA - dateB;
                }

                if (sortValue === 'dateDesc') {
                    return dateB - dateA;
                }

                return 0;
            });
        }

        setFilteredItems(nextItems);
    };

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
            setFilteredItems(response.data);
            setLoading(false);
        } catch (err) {
            const fetchError = err as Error;
            console.error('Error details:', fetchError);
            setError(fetchError.message);
            setLoading(false);
        }
    };

    const fetchProgramOptions = async (): Promise<void> => {
        try {
            const response = await axios.get<Program[]>(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}program`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    },
                },
            );
            setProgramOptions(response.data);
        } catch (err) {
            const fetchError = err as Error;
            console.error('Error fetching program options:', fetchError);
        }
    };

    const fetchAttributes = async () => {
        try {
            const response = await axios.get<
                Array<{
                    descriptor?: string;
                    valueType?: AttributeValueType;
                }>
            >(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}donatedItem/attributes`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    },
                },
            );
            const definitionsFromApi: AttributeDefinition[] = response.data
                .map(attribute => {
                    const descriptor = attribute.descriptor?.trim();
                    if (!descriptor) {
                        return null;
                    }

                    return {
                        descriptor,
                        valueType: attribute.valueType ?? 'string',
                    };
                })
                .filter(isAttributeDefinition);
            const definitionsFromItems = donatedItems.flatMap(item =>
                (item.attributes || [])
                    .map(attribute => {
                        const descriptor = attribute.descriptor?.trim();
                        if (!descriptor) {
                            return null;
                        }

                        let valueType: AttributeValueType = 'string';
                        if (attribute.booleanValue !== null) {
                            valueType = 'boolean';
                        } else if (attribute.numberValue !== null) {
                            valueType = 'number';
                        }

                        return {
                            descriptor,
                            valueType,
                        };
                    })
                    .filter(isAttributeDefinition),
            );
            const mergedDefinitions: AttributeDefinition[] = [
                ...getAllDefaultAttributeDefinitions(),
                ...definitionsFromApi,
                ...definitionsFromItems,
            ];

            setAttributeOptions(
                Array.from(
                    mergedDefinitions
                        .reduce((acc, definition) => {
                            const key = normalize(definition.descriptor);
                            if (!key || acc.has(key)) {
                                return acc;
                            }

                            acc.set(key, definition);
                            return acc;
                        }, new Map<string, AttributeDefinition>())
                        .values(),
                ).sort((a, b) => a.descriptor.localeCompare(b.descriptor)),
            );
        } catch (fetchError) {
            console.error('Error fetching attributes:', fetchError);
        }
    };

    useEffect(() => {
        fetchDonatedItems();
        fetchProgramOptions();
        setSelectedItemDetails(null);
    }, []);

    useEffect(() => {
        const types = new Set(donatedItems.map(item => item.itemType));
        setItemTypes(types);
        fetchAttributes();
        applyFilters();
    }, [
        donatedItems,
        searchInput,
        sortValue,
        itemTypeFilter,
        programFilter,
        statusFilter,
        dateFrom,
        dateTo,
        attributeFilters,
    ]);

    const handleSearch = (term?: string): void => {
        if (typeof term === 'string') {
            setSearchInput(term);
        }
        applyFilters(term);
    };

    const handleSort = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setSortValue(event.target.value);
    };

    const handleFilterByItemName = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ): void => {
        setItemTypeFilter(event.target.value);
    };

    const handleFilterByProgram = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ): void => {
        setProgramFilter(event.target.value);
    };

    const handleFilterByStatus = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ): void => {
        setStatusFilter(event.target.value);
    };

    const handleAddAttributeFilter = (descriptorInput?: string) => {
        const descriptor = (
            descriptorInput ?? selectedAttributeDescriptor
        ).trim();

        if (!descriptor) return;

        const alreadySelected = attributeFilters.some(
            filter => normalize(filter.descriptor) === normalize(descriptor),
        );
        if (alreadySelected) {
            setSelectedAttributeDescriptor('');
            return;
        }

        setAttributeFilters(prev => [
            ...prev,
            {
                descriptor,
                valueType:
                    getAttributeDefinition(descriptor)?.valueType || 'string',
                textValue: '',
                minValue: '',
                maxValue: '',
                booleanValue: '',
            },
        ]);

        if (
            !attributeOptions.some(
                option =>
                    normalize(option.descriptor) === normalize(descriptor),
            )
        ) {
            setAttributeOptions(prev =>
                [
                    ...prev,
                    {
                        descriptor,
                        valueType: 'string' as AttributeValueType,
                    },
                ].sort((a, b) => a.descriptor.localeCompare(b.descriptor)),
            );
        }

        setSelectedAttributeDescriptor('');
        setAdvancedSearchOpen(true);
    };

    const handleUpdateAttributeFilter = (
        descriptor: string,
        updates: Partial<AttributeFilter>,
    ) => {
        setAttributeFilters(prev =>
            prev.map(filter =>
                filter.descriptor === descriptor
                    ? { ...filter, ...updates }
                    : filter,
            ),
        );
    };

    const handleRemoveAttributeFilter = (descriptor: string) => {
        setAttributeFilters(prev =>
            prev.filter(filter => filter.descriptor !== descriptor),
        );
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setSortValue('');
        setItemTypeFilter('');
        setProgramFilter('');
        setStatusFilter('');
        setDateFrom('');
        setDateTo('');
        setSelectedAttributeDescriptor('');
        setAttributeFilters([]);
        setFilteredItems(donatedItems);
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

    return (
        <div className="donated-page">
            {/* Barcode Scanning overlay */}
            {scanning && (
                <div
                    className="scanner-overlay"
                    style={{ visibility: 'visible', pointerEvents: 'auto' }}
                >
                    <video ref={ref} autoPlay playsInline muted />
                    <button
                        onClick={() => {
                            setError(null);
                            setScanning(false);
                            const stream = ref.current
                                ?.srcObject as MediaStream | null;
                            stream?.getTracks().forEach(t => t.stop());
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
            <header className="page-header">
                <h1 className="page-title">Donated Items</h1>
            </header>

            {error && <div className="error-message">{error}</div>}

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
                            className="btn btn-primary scan-button"
                            onClick={handleBeginScan}
                            type="button"
                        >
                            Scan ▣
                        </button>
                        <button
                            className="btn btn-primary search-button"
                            type="submit"
                        >
                            Search 🔍
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
                    value={sortValue}
                >
                    <option value="">Sort</option>
                    <option value="dateAsc">Date Ascending</option>
                    <option value="dateDesc">Date Descending</option>
                </select>

                <select
                    className="filter-options"
                    onChange={handleFilterByItemName}
                    value={itemTypeFilter}
                >
                    <option value="">Filter by Item Type</option>
                    {Array.from(itemTypes).map(type => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>

                <select
                    className="filter-options"
                    onChange={handleFilterByProgram}
                    value={programFilter}
                >
                    <option value="">Filter by Program</option>
                    {programOptions.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>

                <select
                    className="filter-options"
                    onChange={handleFilterByStatus}
                    value={statusFilter}
                >
                    <option value="">Filter by Status</option>
                    <option value="Received">Received</option>
                    <option value="Donated">Donated</option>
                    <option value="In storage facility">
                        In Storage Facility
                    </option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="Item sold">Item Sold</option>
                </select>

                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => setAdvancedSearchOpen(prev => !prev)}
                >
                    {advancedSearchOpen
                        ? 'Hide Advanced Search'
                        : 'Advanced Search'}
                </button>

                <button
                    className="btn"
                    type="button"
                    onClick={handleClearFilters}
                    style={{
                        background: '#fff',
                        border: '1px solid #e5eaf0',
                    }}
                >
                    Clear Filters
                </button>
            </div>

            {advancedSearchOpen && (
                <section
                    style={{
                        width: 'min(1200px, 94vw)',
                        margin: '0 auto 16px',
                        padding: '16px',
                        background: '#fff',
                        border: '1px solid #e5eaf0',
                        borderRadius: 12,
                        boxShadow:
                            '0 10px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '12px',
                            marginBottom: '16px',
                        }}
                    >
                        <label>
                            <div style={{ marginBottom: 6, fontWeight: 600 }}>
                                Date From
                            </div>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={e => setDateFrom(e.target.value)}
                                className="filter-options"
                                style={{ width: '100%' }}
                            />
                        </label>

                        <label>
                            <div style={{ marginBottom: 6, fontWeight: 600 }}>
                                Date To
                            </div>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={e => setDateTo(e.target.value)}
                                className="filter-options"
                                style={{ width: '100%' }}
                            />
                        </label>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '12px',
                            alignItems: 'end',
                            marginBottom: '16px',
                        }}
                    >
                        <label>
                            <div style={{ marginBottom: 6, fontWeight: 600 }}>
                                Attribute Descriptor
                            </div>
                            <select
                                value={selectedAttributeDescriptor}
                                onChange={e =>
                                    setSelectedAttributeDescriptor(
                                        e.target.value,
                                    )
                                }
                                className="filter-options"
                                style={{ width: '100%' }}
                            >
                                <option value="">Select descriptor</option>
                                {attributeOptions.map(option => (
                                    <option
                                        key={option.descriptor}
                                        value={option.descriptor}
                                    >
                                        {option.descriptor}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => handleAddAttributeFilter()}
                            disabled={!selectedAttributeDescriptor}
                        >
                            Add Attribute Filter
                        </button>
                    </div>

                    {attributeFilters.length > 0 && (
                        <div
                            style={{
                                display: 'grid',
                                gap: '12px',
                            }}
                        >
                            {attributeFilters.map(filter => (
                                <div
                                    key={filter.descriptor}
                                    style={{
                                        border: '1px solid #e5eaf0',
                                        borderRadius: 10,
                                        padding: '12px',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '12px',
                                            flexWrap: 'wrap',
                                            marginBottom: '12px',
                                        }}
                                    >
                                        <strong>{filter.descriptor}</strong>
                                        <button
                                            className="btn"
                                            type="button"
                                            onClick={() =>
                                                handleRemoveAttributeFilter(
                                                    filter.descriptor,
                                                )
                                            }
                                            style={{
                                                background: '#fff',
                                                border: '1px solid #e5eaf0',
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns:
                                                'repeat(auto-fit, minmax(180px, 1fr))',
                                            gap: '12px',
                                            alignItems: 'end',
                                        }}
                                    >
                                        <label>
                                            <div
                                                style={{
                                                    marginBottom: 6,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Type
                                            </div>
                                            <div
                                                className="filter-options"
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {filter.valueType === 'number'
                                                    ? 'Number Range'
                                                    : filter.valueType ===
                                                        'boolean'
                                                      ? 'Yes / No'
                                                      : 'Text'}
                                            </div>
                                        </label>

                                        {filter.valueType === 'string' && (
                                            <label>
                                                <div
                                                    style={{
                                                        marginBottom: 6,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Contains
                                                </div>
                                                <input
                                                    type="text"
                                                    value={filter.textValue}
                                                    onChange={e =>
                                                        handleUpdateAttributeFilter(
                                                            filter.descriptor,
                                                            {
                                                                textValue:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        )
                                                    }
                                                    className="filter-options"
                                                    style={{ width: '100%' }}
                                                />
                                            </label>
                                        )}

                                        {filter.valueType === 'number' && (
                                            <>
                                                <label>
                                                    <div
                                                        style={{
                                                            marginBottom: 6,
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Min
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={filter.minValue}
                                                        onChange={e =>
                                                            handleUpdateAttributeFilter(
                                                                filter.descriptor,
                                                                {
                                                                    minValue:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            )
                                                        }
                                                        className="filter-options"
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                    />
                                                </label>

                                                <label>
                                                    <div
                                                        style={{
                                                            marginBottom: 6,
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Max
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={filter.maxValue}
                                                        onChange={e =>
                                                            handleUpdateAttributeFilter(
                                                                filter.descriptor,
                                                                {
                                                                    maxValue:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            )
                                                        }
                                                        className="filter-options"
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                    />
                                                </label>
                                            </>
                                        )}

                                        {filter.valueType === 'boolean' && (
                                            <label>
                                                <div
                                                    style={{
                                                        marginBottom: 6,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Value
                                                </div>
                                                <select
                                                    value={filter.booleanValue}
                                                    onChange={e =>
                                                        handleUpdateAttributeFilter(
                                                            filter.descriptor,
                                                            {
                                                                booleanValue: e
                                                                    .target
                                                                    .value as BooleanFilterValue,
                                                            },
                                                        )
                                                    }
                                                    className="filter-options"
                                                    style={{ width: '100%' }}
                                                >
                                                    <option value="">
                                                        Any
                                                    </option>
                                                    <option value="true">
                                                        Yes
                                                    </option>
                                                    <option value="false">
                                                        No
                                                    </option>
                                                </select>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            <div className="results-meta" aria-live="polite">
                <span className="results-summary">
                    Returned {filteredItems.length}{' '}
                    {filteredItems.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            <table className="item-list">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Item ID</th>
                        <th>Item Type</th>
                        <th>Item Name</th>
                        <th>Status</th>
                        <th>Donation Date</th>
                        <th>Barcode</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <tr
                                key={item.id}
                                className="clickable-row"
                                onClick={() =>
                                    navigate(`/donations/${item.id}`)
                                }
                            >
                                <td>{index + 1}</td>
                                <td>{item.id}</td>
                                <td>{item.itemType}</td>
                                <td>{item.category}</td>
                                <td>{item.currentStatus}</td>
                                <td>
                                    {new Date(
                                        item.dateDonated,
                                    ).toLocaleDateString(undefined, {
                                        timeZone: 'UTC',
                                    })}
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
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} style={{ padding: 24 }}>
                                No donated items match the current filters.
                            </td>
                        </tr>
                    )}
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
