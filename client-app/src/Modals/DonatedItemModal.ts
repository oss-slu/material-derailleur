import { Donor } from '../Modals/DonorModal';
import { Program } from '../Modals/ProgramModal';
import { DonatedItemStatus } from './DonatedItemStatusModal';


export interface DonatedItem {
    id: number;
    itemType: string;
    currentStatus: string;
    dateDonated: string;
    lastUpdated: string;
    donorId: number; // Foreign key for Donor
    programId: number; // Optional Foreign key for Program
    donor: Donor;
    program: Program;
    statuses: DonatedItemStatus[];
}
