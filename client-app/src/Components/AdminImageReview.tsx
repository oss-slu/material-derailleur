import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/AdminImageReview.css';

type TagCategory = 'item_type' | 'condition' | 'damage' | 'other';

interface ImageTag {
  description: string;
  confidence: number;
  category: TagCategory;
}

interface AnalysisMetadata {
  tags?: ImageTag[];
  analyzedAt?: string;
  imagePath?: string;
  version?: number;
  [key: string]: any;
}

interface DonatedItemStatus {
  id: number;
  statusType: string;
  dateModified: string;
  donatedItemId: number;
  imageUrls: string[] | null;
}

interface DonatedItem {
  id: number;
  itemType: string;
  category: string | null;
  quantity: number | null;
  currentStatus: string;
  dateDonated: string;
  lastUpdated: string;
  imagePath: string | null;
  analysisMetadata: AnalysisMetadata | null;
  donorId: number;
  programId: number | null;
  statuses: DonatedItemStatus[];
}

interface ReviewCard {
  id: number;
  title: string;          // from itemType
  category: string;       // friendly string
  imageUrl: string | null;
  analysisMetadata: AnalysisMetadata | null;
}

const AdminImageReview: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [items, setItems] = useState<ReviewCard[]>([]);
  const [selectedItem, setSelectedItem] = useState<ReviewCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [reanalyzingId, setReanalyzingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = useMemo(
    () => (process.env.REACT_APP_BACKEND_API_BASE_URL || 'http://localhost:5050/').replace(/\/?$/, '/'),
    []
  );

  // Normalize token to "Bearer <token>"
  const authHeader = () => {
    const raw = localStorage.getItem('token') || '';
    return raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`;
  };

  useEffect(() => {
    void fetchItemsWithTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If URL param changes OR items update, sync selection:
  useEffect(() => {
    if (!items.length) return;

    if (id) {
      const numeric = Number(id);
      const match = items.find(i => i.id === numeric) || null;
      setSelectedItem(match);
      // If the id doesn't exist in list (e.g., stale link), clear it:
      if (!match) navigate('/admin/image-review', { replace: true });
    } else {
      // No id in URL — show grid; optionally auto-select first item:
      setSelectedItem(null);
      // If you prefer to auto-open the first item, uncomment:
      // setSelectedItem(items[0]);
      // navigate(`/admin/image-review/${items[0].id}`, { replace: true });
    }
  }, [id, items, navigate]);

  const firstImageFromStatuses = (statuses: DonatedItemStatus[]): string | null => {
    if (!Array.isArray(statuses)) return null;
    const withImages = [...statuses]
      .sort((a, b) => new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime())
      .find(s => Array.isArray(s.imageUrls) && s.imageUrls.length > 0);

    return withImages?.imageUrls?.[0] || null;
  };

  const toReviewCard = (d: DonatedItem): ReviewCard => {
    const statusImage = firstImageFromStatuses(d.statuses);
    const fallback = d.imagePath && d.imagePath.startsWith('http') ? d.imagePath : null;

    return {
      id: d.id,
      title: d.itemType || 'Item',
      category: d.category || '—',
      imageUrl: statusImage || fallback,
      analysisMetadata: d.analysisMetadata ?? null,
    };
  };

  const fetchItemsWithTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<DonatedItem[]>(
        `${API_BASE}donatedItem`,
        { headers: { Authorization: authHeader() } }
      );

      const withTags = res.data
        .filter(item => item.analysisMetadata && Array.isArray(item.analysisMetadata.tags))
        .map(toReviewCard);

      setItems(withTags);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch analyzed items');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (item: ReviewCard) => {
    setSelectedItem(item);
    navigate(`/admin/image-review/${item.id}`);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
    navigate('/admin/image-review');
  };

  const handleReanalyze = async (itemId: number) => {
    try {
      setReanalyzingId(itemId);
      setError(null);
      await axios.post(
        `${API_BASE}donatedItem/${itemId}/reanalyze`,
        {},
        { headers: { Authorization: authHeader() } }
      );
      await fetchItemsWithTags();
      // Keep detail open and synced
      const refreshed = items.find(i => i.id === itemId);
      if (refreshed) setSelectedItem(refreshed);
    } catch (e) {
      console.error(e);
      setError('Failed to reanalyze image');
    } finally {
      setReanalyzingId(null);
    }
  };

  return (
    <div className="admin-review-container">
      <div className="header-row">
        <h1>Image Analysis Review</h1>
        <button onClick={fetchItemsWithTags} disabled={loading} className="refresh-btn">
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!selectedItem && (
        <>
          {loading && items.length === 0 ? (
            <div>Loading items...</div>
          ) : (
            <div className="items-grid">
              {items.length === 0 ? (
                <p>No items with image analysis found</p>
              ) : (
                items.map(item => (
                  <div
                    key={item.id}
                    className="item-card"
                    onClick={() => handleOpen(item)}
                    role="button"
                    tabIndex={0}
                  >
                    <h3>{item.title}</h3>
                    <p>Category: {item.category}</p>
                    <p>Tags: {item.analysisMetadata?.tags?.length || 0}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {selectedItem && (
        <div className="detail-panel">
          <div className="detail-header">
            <h2>{selectedItem.title}</h2>
            <button onClick={handleCloseDetail}>Close</button>
          </div>

          {selectedItem.imageUrl && (
            <div className="image-container">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="preview-image"
              />
            </div>
          )}

          <div className="tags-section">
            <h3>Auto-Generated Tags (Gemini)</h3>
            {selectedItem.analysisMetadata?.tags?.length ? (
              <div className="tags-list">
                {selectedItem.analysisMetadata.tags!.map((tag, i) => (
                  <div key={i} className={`tag ${tag.category}`}>
                    <span className="tag-description">{tag.description}</span>
                    <span className="tag-confidence">
                      {(tag.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No tags analyzed for this item</p>
            )}

            <button
              onClick={() => handleReanalyze(selectedItem.id)}
              disabled={reanalyzingId === selectedItem.id}
              className="reanalyze-btn"
            >
              {reanalyzingId === selectedItem.id ? 'Reanalyzing…' : 'Reanalyze Image'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminImageReview;
