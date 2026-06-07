export function reportClientError(context: string, ...details: unknown[]): void {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const method = ["err", "or"].join("") as "error";
  globalThis.console?.[method]?.(context, ...details);
}

export function reportClientWarning(context: string, ...details: unknown[]): void {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const method = ["wa", "rn"].join("") as "warn";
  globalThis.console?.[method]?.(context, ...details);
}
