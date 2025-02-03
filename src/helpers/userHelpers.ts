/**
 * Generates a username from a full name by:
 * 1. Converting to lowercase
 * 2. Taking first character of each name except last + last name
 * Example: "Isaac Nana Sam" becomes "insam"
 */
export function generateUsername(fullName: string): string {
  const cleanName = fullName.toLowerCase().replace(/[^a-z\s]/g, "");
  const nameParts = cleanName.split(" ").filter(Boolean);

  if (nameParts.length === 0) return "";

  // Get all parts except the last name
  const initials = nameParts
    .slice(0, -1)
    .map((name) => name[0])
    .join("");
  const lastName = nameParts[nameParts.length - 1];

  return initials + lastName;
}

/**
 * Generates a simple password with only letters and numbers
 * Length: 8 characters
 */
export function generatePassword(): string {
  const length = 8;
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  return password;
}
