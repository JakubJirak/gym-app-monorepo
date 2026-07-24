import { format } from "date-fns";
import { cs } from "date-fns/locale";

export function toLocalISODateString(date: Date | undefined): string {
	const nechapu = 60_000;
	if (date === undefined || Number.isNaN(date.getTime())) {
		return "";
	}
	const tzOff = date.getTimezoneOffset() * nechapu;
	const localDate = new Date(date.getTime() - tzOff);
	return localDate.toISOString().slice(0, 10);
}

export function getMonthDateRange(monthKey: string) {
	const [year, month] = monthKey.split("-").map(Number);
	const now = new Date();
	const safeYear = year || now.getFullYear();
	const safeMonth = month || now.getMonth() + 1;
	const paddedMonth = String(safeMonth).padStart(2, "0");
	const lastDay = new Date(safeYear, safeMonth, 0).getDate();

	return {
		startDate: `${safeYear}-${paddedMonth}-01`,
		endDate: `${safeYear}-${paddedMonth}-${String(lastDay).padStart(2, "0")}`,
	};
}

export function formatDate(date: Date | null, formatString: string) {
	if (date && !Number.isNaN(date.getTime())) {
		return format(date, formatString, { locale: cs });
	}
	return "neplatne datum";
}
