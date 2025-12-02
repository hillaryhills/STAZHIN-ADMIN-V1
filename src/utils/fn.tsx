// Format currency with commas and optional currency symbol
export const formatAmount = (
  amount: number | string,
  currency: string = ""
): string => {
  if (!amount && amount !== 0) return "";
  const value = typeof amount === "string" ? parseFloat(amount) : amount;

  return currency
    ? `${currency} ${value.toLocaleString()}`
    : value.toLocaleString();
};

// Format full readable date
export const formatDate = (date: string | Date): string => {
  if (!date) return "";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format short date + time
export const formatDateTime = (date: string | Date): string => {
  if (!date) return "";
  return new Date(date).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Return "2 mins ago", "Yesterday", "3 days ago"
export const timeAgo = (date: string | Date): string => {
  if (!date) return "";

  const now = new Date().getTime();
  const past = new Date(date).getTime();
  const diff = (now - past) / 1000;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return "Yesterday";

  return `${Math.floor(diff / 86400)} days ago`;
};

// Format number with commas (e.g. 10000 → 10,000)
export const formatNumber = (value: number | string): string => {
  if (!value && value !== 0) return "";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return num.toLocaleString();
};

// Capitalize First Letter
export const capitalize = (text: string = ""): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Convert string to Title Case
export const toTitleCase = (text: string = ""): string => {
  return text
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

// Truncate long text
export const truncate = (text: string, length: number = 20): string => {
  if (!text) return "";
  return text.length > length ? text.slice(0, length) + "..." : text;
};

// Extract initials for profile images
export const getInitials = (name: string = ""): string => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
};

// Fallback user image
export const userImage = (img: string | null | undefined): string => {
  return img && img.trim() !== "" ? img : "/stazhin-img/user.png";
};
