import React, { useEffect, useState } from 'react';

type Props = {
    donatedItemId: string;
    format?: 'svg' | 'png';
};

const BarcodeDisplay: React.FC<Props> = ({ donatedItemId, format = 'svg' }) => {
    const [loading, setLoading] = useState(false);
    const [dataUrl, setDataUrl] = useState<string>(''); // object URL for blob
    const [rawSvg, setRawSvg] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isSvg, setIsSvg] = useState<boolean>(false);
    const [fileExt, setFileExt] = useState<string>('png');
    const [attempt, setAttempt] = useState<number>(0); // trigger retries without reload

    useEffect(() => {
        if (!donatedItemId) {
            setError('Missing donatedItemId');
            return;
        }
        let objectUrl: string | undefined;

        const handleBlobResult = (
            blob: Blob,
            extGuess = 'png',
            svgText?: string,
        ) => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            objectUrl = URL.createObjectURL(blob);
            setDataUrl(objectUrl);
            setIsSvg(extGuess === 'svg');
            setFileExt(extGuess);
            if (svgText) setRawSvg(svgText);
        };

        const fetchAsFormat = async (requestedFormat: 'svg' | 'png') => {
            const backendBase = (
                process.env.REACT_APP_BACKEND_API_BASE_URL || ''
            ).replace(/\/+$/, '');
            const prefix = backendBase || '';
            const fetchUrl = `${prefix}/api/barcode/${encodeURIComponent(donatedItemId)}?format=${requestedFormat}`;
            console.debug('Fetching barcode from:', fetchUrl);
            const headers: Record<string, string> = { Accept: 'image/*' };
            const token = localStorage.getItem('token');
            if (token) headers.Authorization = token;
            return fetch(fetchUrl, {
                method: 'GET',
                cache: 'no-store',
                headers,
            });
        };

        const fetchBarcode = async () => {
            setError('');
            setLoading(true);
            setDataUrl('');
            setRawSvg('');
            setIsSvg(false);

            try {
                // request once (initially with desired format)
                let res = await fetchAsFormat(format);
                let contentType = (
                    res.headers.get('content-type') || ''
                ).toLowerCase();

                // read body exactly once as blob
                const blob = await res.blob();

                // If response not ok, try to parse textual error from blob
                if (!res.ok) {
                    let bodyText = '';
                    try {
                        bodyText = await blob.text();
                    } catch (_) {
                        bodyText = '';
                    }
                    if (contentType.includes('application/json')) {
                        try {
                            const json = JSON.parse(bodyText);
                            bodyText = json.message || JSON.stringify(json);
                        } catch (e) {
                            /* ignore */
                        }
                    }
                    const msg = `Server returned ${res.status} ${res.statusText}${bodyText ? ` — ${bodyText}` : ''}`;
                    console.error(msg);
                    setError(msg);
                    return;
                }

                // Handle explicit SVG content-type
                if (contentType.includes('svg') || blob.type.includes('svg')) {
                    // get text to validate
                    const svgText = await blob.text();
                    const trimmed = (svgText || '').trim();
                    if (
                        !trimmed.startsWith('<svg') &&
                        !trimmed.startsWith('<?xml')
                    ) {
                        // Not a valid SVG text; fall back to PNG attempt if original request was SVG
                        if (format === 'svg') {
                            console.warn(
                                'SVG content-type but body is not valid SVG; trying PNG fallback',
                            );
                            // try PNG fallback below
                        } else {
                            setError('Server returned invalid SVG content');
                            return;
                        }
                    } else {
                        // Use the same blob (we created it from text) for display/download
                        const svgBlob = new Blob([svgText], {
                            type: 'image/svg+xml;charset=utf-8',
                        });
                        handleBlobResult(svgBlob, 'svg', svgText);
                        return;
                    }
                }

                // Handle general image/* responses (png, jpeg, etc.)
                if (
                    contentType.startsWith('image/') ||
                    blob.type.startsWith('image/')
                ) {
                    const ext =
                        contentType.split('/')[1]?.split(';')[0] ||
                        blob.type.split('/')[1] ||
                        'png';
                    handleBlobResult(blob, ext);
                    return;
                }

                // If content-type wasn't helpful, inspect text to see if it's SVG.
                let maybeText = '';
                try {
                    maybeText = await blob.text();
                } catch (_) {
                    maybeText = '';
                }
                const trimmed = (maybeText || '').trim();
                if (trimmed.startsWith('<?xml') || trimmed.startsWith('<svg')) {
                    const svgBlob = new Blob([maybeText], {
                        type: 'image/svg+xml;charset=utf-8',
                    });
                    handleBlobResult(svgBlob, 'svg', maybeText);
                    return;
                }

                // If we requested SVG but did not receive SVG, try PNG fallback once
                if (format === 'svg') {
                    console.warn(
                        'Requested SVG but did not receive SVG; attempting PNG fallback',
                    );
                    const pngRes = await fetchAsFormat('png');
                    const pngContentType = (
                        pngRes.headers.get('content-type') || ''
                    ).toLowerCase();
                    const pngBlob = await pngRes.blob();
                    if (!pngRes.ok) {
                        let body = '';
                        try {
                            body = await pngBlob.text();
                        } catch (_) {
                            body = '';
                        }
                        const msg = `PNG fallback failed: ${pngRes.status} ${pngRes.statusText}${body ? ` — ${body}` : ''}`;
                        console.error(msg);
                        setError(msg);
                        return;
                    }
                    if (
                        pngContentType.startsWith('image/') ||
                        pngBlob.type.startsWith('image/')
                    ) {
                        const ext =
                            pngContentType.split('/')[1]?.split(';')[0] ||
                            pngBlob.type.split('/')[1] ||
                            'png';
                        handleBlobResult(pngBlob, ext);
                        return;
                    }
                    let body = '';
                    try {
                        body = await pngBlob.text();
                    } catch (_) {
                        body = '';
                    }
                    setError(
                        `PNG fallback returned unexpected content: ${pngContentType} — ${body.substring(0, 300)}`,
                    );
                    return;
                }

                // final fallback
                setError(
                    `Unexpected response type: ${contentType} — ${maybeText?.substring(0, 200)}`,
                );
            } catch (err: any) {
                console.error('Fetch error:', err);
                setError(
                    err?.message || 'Network error while fetching barcode',
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBarcode();

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
        // re-run when donatedItemId, format or attempt changes
    }, [donatedItemId, format, attempt]);

    const handleDownload = () => {
        if (!dataUrl) return;
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${donatedItemId}.${fileExt || (isSvg ? 'svg' : 'png')}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const handlePrint = () => {
        const w = window.open('', '_blank', 'noopener,noreferrer');
        if (!w) return;

        if (isSvg && rawSvg) {
            w.document.write(`
				<!doctype html><html><head><title>Print Barcode</title></head>
				<body style="margin:0;display:flex;align-items:center;justify-content:center">
				${rawSvg}
				<script>
					window.onload = function(){ window.print(); window.onafterprint = function(){ window.close(); } };
				</script>
				</body></html>`);
            w.document.close();
            return;
        }

        if (dataUrl) {
            w.document.write(`
				<!doctype html><html><head><title>Print Barcode</title></head>
				<body style="margin:0;display:flex;align-items:center;justify-content:center">
				<img id="print-img" src="${dataUrl}" alt="barcode" style="max-width:100%;height:auto" />
				<script>
					(function(){
						var img = document.getElementById('print-img');
						if(img.complete){
							window.print(); window.onafterprint = function(){ window.close(); };
						} else {
							img.onload = function(){ window.print(); window.onafterprint = function(){ window.close(); } };
							img.onerror = function(){ document.body.innerText = 'Failed to load image for printing.'; };
						}
					})();
				</script>
				</body></html>`);
            w.document.close();
            return;
        }

        w.document.write(
            '<!doctype html><html><body><div>No barcode available to print</div></body></html>',
        );
        w.document.close();
    };

    return (
        <div className="barcode-display">
            {loading && <div>Loading barcode…</div>}

            {error && (
                <div style={{ color: 'crimson', marginBottom: 12 }}>
                    <div>
                        <strong>Error:</strong> {error}
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <button onClick={() => setAttempt(a => a + 1)}>
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {!loading && !error && !dataUrl && (
                <div>No barcode to display.</div>
            )}

            {!loading && dataUrl && (
                <>
                    <div style={{ marginBottom: 8 }}>
                        <img
                            src={dataUrl}
                            alt={`barcode-${donatedItemId}`}
                            style={{ maxWidth: '100%', height: 'auto' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button type="button" onClick={handleDownload}>
                            Download
                        </button>
                        <button type="button" onClick={handlePrint}>
                            Print
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default BarcodeDisplay;
