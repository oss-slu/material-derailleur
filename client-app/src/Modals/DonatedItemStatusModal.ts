export interface DonatedItemStatus {
    id: number;
    dateModified: string;
    statusType: string;
    donatedItemId: number;
    imageUrls: string[];
    images: string[];
    donorInformed: boolean;
    approval: boolean;
}