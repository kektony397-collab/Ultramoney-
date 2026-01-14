export interface DenominationCounts {
    [key: number]: number;
}

export interface LogEntry {
    id?: number;
    shop: string;
    total: number;
    breakdown: DenominationCounts;
    timestamp: Date;
}

export type ViewType = 'counter' | 'banking' | 'history';

export const DENOMINATIONS = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];