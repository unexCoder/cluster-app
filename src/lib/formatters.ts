export const VENUE_TYPE_LABELS: Record<string, string> = {
  club: "Club",
  conference_center: "Centro Cultural",
  outdoor: "Outdoor Venue",
  warehouse: "Warehouse",
};

export function getVenueTypeLabel(type?: string): string | null {
  if (!type) return null;

  return (
    VENUE_TYPE_LABELS[type] ??
    type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
  );
}