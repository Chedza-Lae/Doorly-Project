const ptDateFormatter = new Intl.DateTimeFormat("pt-PT");

function fromParts(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function formatDate(value?: string | null, fallback = "Data a combinar") {
  if (!value) return fallback;

  const text = String(value).trim();
  const isoDate = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) {
    const date = fromParts(Number(isoDate[1]), Number(isoDate[2]), Number(isoDate[3]));
    return date ? ptDateFormatter.format(date) : fallback;
  }

  const ptDate = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ptDate) {
    const date = fromParts(Number(ptDate[3]), Number(ptDate[2]), Number(ptDate[1]));
    return date ? ptDateFormatter.format(date) : fallback;
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? fallback : ptDateFormatter.format(date);
}
