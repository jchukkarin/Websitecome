import { ReportItem, TimeRange } from "./report.types";

export function groupByTime(
    data: ReportItem[],
    range: TimeRange
) {
    const map: Record<string, number> = {};

    data.forEach(d => {
        const date = new Date(d.date);
        let key = "";

        switch (range) {
            case "DAY":
                key = date.toLocaleDateString("th-TH", { day: '2-digit', month: '2-digit' });
                break;
            case "WEEK":
                const weekNum = Math.ceil(date.getDate() / 7);
                key = `สัปดาห์ที่ ${weekNum} (${date.toLocaleDateString("th-TH", { month: 'short' })})`;
                break;
            case "MONTH":
                key = date.toLocaleDateString("th-TH", { month: "short", year: "2-digit" });
                break;
            case "YEAR":
                key = (date.getFullYear() + 543).toString();
                break;
        }

        map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([label, value]) => ({
        label,
        value,
    }));
}
