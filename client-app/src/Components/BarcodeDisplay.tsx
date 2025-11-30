import React, { useEffect, useRef, useState } from 'react';

type Props = {
    donatedItemId: string;
    format?: 'svg' | 'png';
};

const PRINT_STYLE_ID = 'barcode-print-style';
const PRINT_CONTAINER_ID = 'barcode-print-container';

const BarcodeDisplay: React.FC<Props> = ({ donatedItemId, format = 'svg' }) => {
    const [loading, setLoading] = useState(false);
    const [dataUrl, setDataUrl] = useState<string>(''); // object URL for blob
    const [rawSvg, setRawSvg] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isSvg, setIsSvg] = useState<boolean>(false);
    const [fileExt, setFileExt] = useState<string>('png');
    const [attempt, setAttempt] = useState<number>(0);

    //  reference the already-rendered image (so printing can be synchronous)
    const displayImgRef = useRef<HTMLImageElement | null>(null);

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
                const res = await fetchAsFormat(format);
                const contentType = (
                    res.headers.get('content-type') || ''
                ).toLowerCase();
                const blob = await res.blob();

                if (!res.ok) {
                    let bodyText = '';
                    try {
                        bodyText = await blob.text();
                    } catch {
                        bodyText = '';
                    }
                    if (contentType.includes('application/json')) {
                        try {
                            const json = JSON.parse(bodyText);
                            bodyText = json.message || JSON.stringify(json);
                        } catch {
                            /* ignore */
                        }
                    }
                    setError(
                        `Server returned ${res.status} ${res.statusText}${bodyText ? ` — ${bodyText}` : ''}`,
                    );
                    return;
                }

                // SVG
                if (contentType.includes('svg') || blob.type.includes('svg')) {
                    const svgText = await blob.text();
                    const trimmed = (svgText || '').trim();
                    if (
                        trimmed.startsWith('<svg') ||
                        trimmed.startsWith('<?xml')
                    ) {
                        const svgBlob = new Blob([svgText], {
                            type: 'image/svg+xml;charset=utf-8',
                        });
                        handleBlobResult(svgBlob, 'svg', svgText);
                        return;
                    }
                }

                // image/*
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

                // fallback sniff
                let maybeText = '';
                try {
                    maybeText = await blob.text();
                } catch {
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

                // SVG -> PNG fallback once
                if (format === 'svg') {
                    const pngRes = await fetchAsFormat('png');
                    const pngType = (
                        pngRes.headers.get('content-type') || ''
                    ).toLowerCase();
                    const pngBlob = await pngRes.blob();

                    if (!pngRes.ok) {
                        let body = '';
                        try {
                            body = await pngBlob.text();
                        } catch {
                            body = '';
                        }
                        setError(
                            `PNG fallback failed: ${pngRes.status} ${pngRes.statusText}${body ? ` — ${body}` : ''}`,
                        );
                        return;
                    }

                    if (
                        pngType.startsWith('image/') ||
                        pngBlob.type.startsWith('image/')
                    ) {
                        const ext =
                            pngType.split('/')[1]?.split(';')[0] ||
                            pngBlob.type.split('/')[1] ||
                            'png';
                        handleBlobResult(pngBlob, ext);
                        return;
                    }
                }

                setError(`Unexpected response type: ${contentType}`);
            } catch (err: any) {
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
    }, [donatedItemId, format, attempt]);

    const handleDownload = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (!dataUrl) return;
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${donatedItemId}.${fileExt || (isSvg ? 'svg' : 'png')}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const ensurePrintStyleAndContainer = (): HTMLDivElement => {
        if (!document.getElementById(PRINT_STYLE_ID)) {
            const style = document.createElement('style');
            style.id = PRINT_STYLE_ID;
            style.textContent = `
@media print {
  body * { visibility: hidden !important; }
  #${PRINT_CONTAINER_ID}, #${PRINT_CONTAINER_ID} * { visibility: visible !important; }
  #${PRINT_CONTAINER_ID} {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12mm;
    background: white;
  }
  #${PRINT_CONTAINER_ID} img, #${PRINT_CONTAINER_ID} svg {
    max-width: 100% !important;
    height: auto !important;
  }
}
            `;
            document.head.appendChild(style);
        }

        let container = document.getElementById(
            PRINT_CONTAINER_ID,
        ) as HTMLDivElement | null;
        if (!container) {
            container = document.createElement('div');
            container.id = PRINT_CONTAINER_ID;
            container.style.position = 'fixed';
            container.style.left = '-99999px';
            container.style.top = '0';
            container.style.width = '1px';
            container.style.height = '1px';
            container.style.overflow = 'hidden';
            document.body.appendChild(container);
        }
        return container;
    };

    // Synchronous print to keep browser “user gesture” and prevent blocking
    const handlePrint = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        setError('');

        if (!dataUrl && !(isSvg && rawSvg)) {
            setError('No barcode available to print');
            return;
        }

        const container = ensurePrintStyleAndContainer();

        const cleanup = () => {
            container.innerHTML = '';
            window.removeEventListener('afterprint', cleanup);
        };
        window.addEventListener('afterprint', cleanup);

        try {
            if (isSvg && rawSvg) {
                const svgWithNamespace = rawSvg.includes('xmlns')
                    ? rawSvg
                    : rawSvg.replace(
                          /^<svg/,
                          '<svg xmlns="http://www.w3.org/2000/svg"',
                      );
                container.innerHTML = svgWithNamespace;
                window.print();
                return;
            }

            // Use the already rendered img element (should already be loaded)
            const onScreenImg = displayImgRef.current;
            if (
                !onScreenImg ||
                !onScreenImg.complete ||
                onScreenImg.naturalWidth === 0
            ) {
                cleanup();
                setError(
                    'Barcode image is not fully loaded yet. Wait a moment and try Print again.',
                );
                return;
            }

            const clone = onScreenImg.cloneNode(true) as HTMLImageElement;
            clone.removeAttribute('style'); // we control sizing via print CSS

            container.innerHTML = '';
            container.appendChild(clone);

            window.print();
        } catch (err: any) {
            cleanup();
            setError(err?.message || 'Failed to print barcode');
        }
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
                        <button
                            type="button"
                            onClick={() => setAttempt(a => a + 1)}
                        >
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
                            ref={displayImgRef}
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
