import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/AdminImageApproval.css'; // Reuse image approval styling

const AdminImportExport: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const base = process.env.REACT_APP_BACKEND_API_BASE_URL || '/';

    useEffect(() => {});

    if (loading) return <div>Loading users...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: 20, paddingTop: 80 }}>
            <h2>Import and Export Dashboard</h2>
        </div>
    );
};

export default AdminImportExport;
