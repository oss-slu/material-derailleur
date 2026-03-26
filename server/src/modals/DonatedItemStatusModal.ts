export interface DonatedItemStatus {
    id: number;
    statusType: string;
    dateModified: Date;
    donatedItemId: number;
    imageUrls?: string[];
    images?: string[];
    submitter: string;
}
