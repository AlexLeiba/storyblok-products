import Box from "@mui/material/Box";
import { StoryblokComponent } from "@storyblok/react";
import { storyblokEditable } from "@storyblok/react/rsc";

export default function Page({ blok }: { blok: PageType }) {
  // console.log("🚀 ~ Page ~ blok:", blok);
  // Complete story object === name:string,slug:string
  // IN CASE of rendering a storyblok component (not a slug) we will pass the blok object to StoryblokComponent which will render the component based on the blok.component (type) value and pass the entire blok object to that component as props.
  return (
    <main {...storyblokEditable(blok)}>
      <Box sx={{ display: "grid", gap: 4 }}>
        {blok.body.map((blok: any) => (
          <StoryblokComponent blok={blok} key={blok._uid} />
        ))}
      </Box>
    </main>
  );
}

type BlokType = {
  _editable: any;
  _uid: string;
  component: string;
};
export type DashboardType = BlokType & {
  body: any[];
  component: string;
};

export type HeroType = BlokType & {
  description: string;
  headline: string;
  image: {
    filename: string;
  };
};

export type GridType = BlokType & {
  headline: string;
  items: any[];
};

export type LatestProductsType = BlokType & {
  headline: string;
  products: any[];
};

type PageType = {
  body: any[];
};
