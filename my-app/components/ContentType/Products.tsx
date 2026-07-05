import Box from "@mui/material/Box";
import { StoryblokComponent } from "@storyblok/react";
import { storyblokEditable } from "@storyblok/react/rsc";

type PageType = {
  items: any[];
};

export default function Products({ blok }: { blok: PageType }) {
  // console.log("🚀 ~ Page ~ blok:", blok);
  // Complete story object === name:string,slug:string
  // IN CASE of rendering a storyblok component we will pass the blok object to StoryblokComponent which will render the component based on the blok.component value and pass the entire blok object to that component as props.
  return (
    <main {...storyblokEditable(blok)}>
      <Box sx={{ display: "grid", gap: 4 }}>
        {blok.items.map((blok: any) => (
          <StoryblokComponent blok={blok} key={blok._uid} />
        ))}
      </Box>
    </main>
  );
}
