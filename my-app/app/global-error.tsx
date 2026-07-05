//catch entire app errors(including root layoput)
// runtime and render errors
// Catches errors that error.tsx cannot, such as errors in the root layout.
// app/global-error.tsx
// Unlike error.tsx, it must return the full <html> and <body> structure.
// final fallback for uncaught rendering errors
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h1>Something went wrong.</h1>
        <button onClick={reset}>Retry</button>
      </body>
    </html>
  );
}
