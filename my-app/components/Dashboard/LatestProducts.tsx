import { Box, Button, Typography } from "@mui/material";
import { StoryblokStory } from "@storyblok/react/rsc";
import Link from "next/link";

type ProductType = {
  headline: string;
  products: any[];
};
export default async function LatestProducts({ blok }: { blok: ProductType }) {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h3">
          {blok.headline}
        </Typography>
        <Link href="/dashboard/products">
          <Button variant="outlined">View all</Button>
        </Link>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {blok.products.map((blok: any) => (
          <Link href={`/dashboard/products/${blok.slug}`} key={blok.id}>
            <StoryblokStory story={blok} />
          </Link>
        ))}
      </Box>
    </div>
  );
}
