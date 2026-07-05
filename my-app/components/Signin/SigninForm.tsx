"use client";
import { useState, FormEvent } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { signinSchema } from "@/schemas/auth";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";

type FormState = {
  email: string;
  password: string;
};

export default function SignInForm() {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    const parsed = signinSchema.safeParse(form);

    try {
      if (!parsed.success) {
        throw new Error(JSON.parse(parsed.error.message)[0].message);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // for httpOnly cookies
          body: JSON.stringify(form),
        },
      );
      if (!res.ok) throw new Error("Invalid email or password");

      router.push("/dashboard");
      // redirect to dashboard, etc.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Sign in
      </Typography>
      <Box // generic layout container with access to MUI props (theme, sx, etc)
        component="form" //makes it a form
        onSubmit={handleSubmit}
        sx={{ display: "grid", gap: 2, maxWidth: 800 }}
      >
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          required
          fullWidth
          error={!!error}
        />
        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange("password")}
          fullWidth
          error={!!error}
        />
        {/* error.main is a MUI color token, defined in theme.ts */}
        {error && <Box sx={{ color: "error.main" }}>{error}</Box>}
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </Box>
    </>
  );
}
