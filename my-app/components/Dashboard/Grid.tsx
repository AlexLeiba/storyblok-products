import Typography from "@mui/material/Typography";
import { GridType } from "../ContentType/Page";
// import { StoryblokStory } from "@storyblok/react/rsc";
import { StoryblokComponent } from "@storyblok/react";
import Box from "@mui/material/Box";

export default async function Grid({ blok }: { blok: GridType }) {
  // console.log("🚀 ~ Grid ~ blok:", blok);
  return (
    <div>
      <Typography variant="h4" component="h2">
        {blok.headline}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 2,
        }}
      >
        {blok.items.map((blok: any) => (
          <StoryblokComponent key={blok._uid} blok={blok} />
        ))}
      </Box>
    </div>
  );
}
