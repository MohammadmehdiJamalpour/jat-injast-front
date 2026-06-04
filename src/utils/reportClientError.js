export function reportClientError(context, ...details) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  globalThis.console?.error?.(context, ...details);
}

export function reportClientWarning(context, ...details) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  globalThis.console?.warn?.(context, ...details);
}
