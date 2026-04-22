import React, { useState } from 'react';
import '../css/AdminImportExport.css';

const AdminImportExport: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem('token');
    const base = process.env.REACT_APP_BACKEND_API_BASE_URL || '/';

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setSelectedFile(file);
        setMessage(null);
        setError(null);
    };

    const handleImport = async () => {
        if (!selectedFile) {
            setError('Please select a CSV file to import.');
            return;
        }

        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('csvFile', selectedFile);

            const response = await fetch(`${base}api/csv`, {
                method: 'POST',
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || data.message || 'Import failed');
            }

            setMessage(
                data.message ||
                    `Import completed. ${data.importedCount ?? 0} item(s) added.`,
            );
            setSelectedFile(null);
        } catch (err: any) {
            setError(err.message || 'Failed to import CSV file.');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await fetch(`${base}api/csv`, {
                method: 'GET',
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });

            if (!response.ok) {
                let errorMessage = 'Export failed';

                try {
                    const data = await response.json();
                    errorMessage = data.error || data.message || errorMessage;
                } catch {
                    const text = await response.text();
                    errorMessage = text || errorMessage;
                }

                throw new Error(errorMessage);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'donated-items-export.csv';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setMessage('Export downloaded successfully.');
        } catch (err: any) {
            setError(err.message || 'Failed to export CSV file.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20, paddingTop: 80 }}>
            <h2>Import and Export Dashboard</h2>
            <div
                style={{
                    padding: 20,
                    marginTop: 20,
                }}
            >
                <div style={{ marginBottom: 20 }}>
                    <h4>Import CSV</h4>
                    <input
                        className="import-file-input"
                        type="file"
                        accept=".csv,text/csv"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                    <div style={{ marginTop: 12 }}>
                        <button
                            onClick={handleImport}
                            disabled={loading || !selectedFile}
                        >
                            {loading ? 'Processing...' : 'Submit Import'}
                        </button>
                    </div>
                    {selectedFile && (
                        <div style={{ marginTop: 8 }}>
                            Selected file: {selectedFile.name}
                        </div>
                    )}
                </div>

                <div>
                    <h4>Export CSV</h4>
                    <button onClick={handleExport} disabled={loading}>
                        {loading ? 'Processing...' : 'Download Export'}
                    </button>
                </div>

                {message && (
                    <div style={{ color: 'green', marginTop: 16 }}>
                        {message}
                    </div>
                )}
                {error && (
                    <div style={{ color: 'red', marginTop: 16 }}>{error}</div>
                )}
            </div>
        </div>
    );
};

export default AdminImportExport;
