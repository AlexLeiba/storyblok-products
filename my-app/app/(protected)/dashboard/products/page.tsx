import { Box } from "@mui/material";
import { getStoryblokApi, StoryblokStory } from "@storyblok/react/rsc";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products",
  description: "Products",
};

async function fetchProductsData() {
  const client = getStoryblokApi();

  const response = await client.getStories({
    version: process.env.NODE_ENV === "development" ? "draft" : "published", //after next dev command ( the NODE_ENV will be development, after next build and next start command the NODE_ENV will be production), so we can use this to determine if we want to fetch draft or published content.
    content_type: "products", //fetching all stories of content type "product" (this is the content type we created in storyblok)
  });

  return response.data.stories;
}

export default async function Products() {
  const response = await fetchProductsData();

  return (
    <Box
      sx={{
        mt: 4,
        display: "grid",
        gap: 4,
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      }}
    >
      {response.map((blok: any) => (
        <Link href={`/dashboard/products/${blok.slug}`} key={blok.id}>
          <StoryblokStory story={blok} />
        </Link>
      ))}
    </Box>
  );
}
