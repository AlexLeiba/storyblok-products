"use client";
import { useState, FormEvent } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { signupSchema } from "@/schemas/auth";
import { Typography } from "@mui/material";

type FormState = {
  email: string;
  password: string;
  name: string;
};

export default function SignUpForm() {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const parsed = signupSchema.safeParse(form);

    try {
      if (!parsed.success) {
        throw new Error(JSON.parse(parsed.error.message)[0].message);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // for httpOnly cookies
          body: JSON.stringify(form),
        },
      );
      if (!res.ok) throw new Error("Invalid email or password");
      // redirect to dashboard, etc.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Sign up
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "grid", gap: 2, maxWidth: 400 }}
      >
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
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
        <TextField
          label="name"
          type="text"
          value={form.name}
          onChange={handleChange("name")}
          fullWidth
          error={!!error}
        />
        {error && <Box sx={{ color: "error.main" }}>{error}</Box>}
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </Button>
      </Box>
    </div>
  );
}
