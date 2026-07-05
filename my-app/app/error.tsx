// app/dashboard/error.tsx
// catches errors of the entire app except root layout
"use client";

export default function Error({
  error,
  reset, //to retry rendering
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
