import * as fs from 'fs';

const RERUM_BASE = "http://localhost:3001/v1/api";

function getToken(path: string = "../rerum_server_nodejs/token.txt"): string {
    return fs.readFileSync(path, 'utf8').trim();
}

async function submitRerumDonation(donationText: string, donationId: string): Promise<[boolean, string | null]> {
    console.log("Submitting donation to RERUM server...");
    const token = getToken();
    const donation = {
        "@context": "http://www.w3.org/ns/anno.jsonld",
        "type": "donation",
        "body": {
            "type": "TextualBody",
            "value": donationText
        },
        "target": donationId
    };
    
    const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
    
    try {
        const response = await fetch(`${RERUM_BASE}/create`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(donation)
        });
        
        if (response.status === 200 || response.status === 201) {
            const data = await response.json();
            const donationId = data['@id'] || null;
            return [true, donationId];
        } else {
            const errorText = await response.text();
            return [false, errorText];
        }
    } catch (e) {
        return [false, String(e)];
    }
}


export {
    getToken,
    submitRerumDonation
};

