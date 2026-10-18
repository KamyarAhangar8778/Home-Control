/**
 * @file utils/scheduler.ts
 * محاسبه زمان trigger بعدی برای اتوماسیون‌های زمانبندی‌شده
 * با پشتیبانی از منطقه زمانی تهران (UTC+3:30)
 */

const TEHRAN_OFFSET_MS = 3.5 * 60 * 60 * 1000;

/**
 * محاسبه timestamp بعدی که یک اتوماسیون باید فعال شود.
 *
 * @param timeStr  زمان به فرمت "HH:MM"
 * @param daysArray آرایه روزهای هفته (0=یکشنبه، 6=شنبه)
 * @param referenceDate تاریخ مرجع برای محاسبه (پیش‌فرض: now)
 * @returns timestamp میلی‌ثانیه‌ای یا null اگر هیچ روزی تعریف نشده
 */
export function getNextTriggerTimestamp(
	timeStr: string,
	daysArray: number[],
	referenceDate?: Date,
	intervalMinutes?: number
): number | null {
	const now = referenceDate ?? new Date();

	if (intervalMinutes && intervalMinutes > 0) {
		return now.getTime() + intervalMinutes * 60 * 1000;
	}

	if (!daysArray || daysArray.length === 0) return null;

	const [hours, minutes] = timeStr.split(":").map(Number);
	const nowTehran = new Date(now.getTime() + TEHRAN_OFFSET_MS);

	let bestDelay = Infinity;

	for (const day of daysArray) {
		let dayDiff = day - nowTehran.getUTCDay();
		if (dayDiff < 0) dayDiff += 7;

		const candidate = new Date(nowTehran);
		candidate.setUTCDate(candidate.getUTCDate() + dayDiff);
		candidate.setUTCHours(hours, minutes, 0, 0);

		// اگر امروز بود اما زمان گذشته، ۷ روز جلو برو
		if (dayDiff === 0 && candidate.getTime() <= nowTehran.getTime()) {
			candidate.setUTCDate(candidate.getUTCDate() + 7);
		}

		const delay = candidate.getTime() - nowTehran.getTime();
		if (delay < bestDelay) {
			bestDelay = delay;
		}
	}

	if (bestDelay === Infinity) return null;
	return now.getTime() + bestDelay;
}
