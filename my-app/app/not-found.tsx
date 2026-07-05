// When a route isnt found.
// can be triggered from a page: import { notFound } from 'next/navigation';
// It is also shown automatically when a route doesn't exist.
export default function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}
