"use client";
import { useState } from "react";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

export default function Signout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // for httpOnly cookies
        },
      );
      if (!res.ok) throw new Error("Something went wrong");

      router.push("/signin");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button onClick={handleSubmit} variant="contained" disabled={loading}>
        {loading ? "Signing out..." : "Sign out"}
      </Button>
    </>
  );
}
