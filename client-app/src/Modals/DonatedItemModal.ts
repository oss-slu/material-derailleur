import { Donor } from '../Modals/DonorModal';
import { Program } from '../Modals/ProgramModal';
import { DonatedItemStatus } from './DonatedItemStatusModal';

export interface ItemAttribute {
    id: number;
    descriptor: string;
    stringValue: string | null;
    numberValue: number | null;
    booleanValue: boolean | null;
}

export interface DonatedItem {
    id: number;
    itemType: string;
    category: string;
    quantity: number;
    currentStatus: string;
    dateDonated: string;
    lastUpdated: string;
    donorId: number; // Foreign key for Donor
    programId: number | null; // Optional Foreign key for Program
    donor: Donor;
    program: Program | null;
    attributes: ItemAttribute[];
    statuses: DonatedItemStatus[];
}
