export function canAccessOwnedRecord(
  authenticatedUserId: string | null,
  recordUserId: string,
): boolean {
  return authenticatedUserId !== null && authenticatedUserId === recordUserId;
}

export function isPublicDataTable(table: string): boolean {
  return [
    "universities",
    "programs",
    "scholarships",
    "requirements",
    "deadlines",
    "sources",
    "data_verification",
  ].includes(table);
}
