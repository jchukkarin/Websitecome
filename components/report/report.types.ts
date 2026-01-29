export type ReportType = "IMPORT" | "CONSIGN" | "REPAIR" | "PAWN";
export type TimeRange = "DAY" | "WEEK" | "MONTH" | "YEAR";

export interface ReportItem {
    id: string;
    type: ReportType;
    date: string;
    price?: number;
    productName?: string;
}
