import { cookies } from "next/headers";

export default async function VerifyUser() {
  const cookieStore = await cookies();
  console.log("cookieStore\n\n\n\n\n", cookieStore);
  try {
    const res = await fetch(`http://localhost:8000/api/profile`, {
      method: "GET",
      credentials: "include", // for httpOnly cookies
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    console.log(res);

    const response = await res.json();
    console.log(response);

    if (!res.ok) throw new Error(res.statusText);
    // if (!res.ok) throw new Error("Something went wrong");
  } catch (error) {
    console.log("Error \n\n\n\n", error);
  }
  return <></>;
}
