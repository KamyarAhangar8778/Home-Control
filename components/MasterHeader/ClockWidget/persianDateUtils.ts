const ZOROASTRIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "امرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export const toPersianDigits = (num: number | string) => {
  const id = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/[0-9]/g, (w) => id[+w]);
};

export const getPersianDateString = (time: Date) => {
  const formatter = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  
  const parts = formatter.formatToParts(time);
  let jYear = 1400;
  let jMonth = 1;
  let jDay = 1;

  parts.forEach((p) => {
    if (p.type === "year") jYear = parseInt(p.value, 10);
    if (p.type === "month") jMonth = parseInt(p.value, 10);
    if (p.type === "day") jDay = parseInt(p.value, 10);
  });

  const shahanshahiYear = jYear + 1180;
  const monthName = ZOROASTRIAN_MONTHS[jMonth - 1] || "نامشخص";
  
  return `${toPersianDigits(jDay)} ${monthName} ${toPersianDigits(shahanshahiYear)}`;
};

export const getTimeString = (time: Date) => {
  return time.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
