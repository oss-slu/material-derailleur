import React from 'react';
import { DonatedItem } from '../Modals/DonatedItemModal';

const CertificateTemplate: React.FC = () => {
    const certificateItem = JSON.parse(localStorage.getItem('certificateItem') || 'null') as DonatedItem | null;

    if (!certificateItem) {
        return <div>No certificate data available</div>;
    }

    return (
        <div className="text-center font-serif p-8">
            <h1 className="text-3xl font-bold mb-6">Certificate of Appreciation</h1>
            <p className="text-lg">
                This certifies that <span className="font-semibold">{certificateItem.donor?.firstName} {certificateItem.donor?.lastName}</span><br />
                has generously donated <span className="font-semibold">{certificateItem.itemType}</span><br />
                on <span className="italic">{new Date(certificateItem.dateDonated).toLocaleDateString()}</span>.
            </p>
        </div>
    );
};

export default CertificateTemplate;
