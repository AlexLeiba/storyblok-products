import CategoryCard from "@/components/CategoryCard";
import Grid from "@/components/Dashboard/Grid";
import Hero from "@/components/Dashboard/Hero";
import LatestProducts from "@/components/Dashboard/LatestProducts";
import Page from "@/components/ContentType/Page";
import ProductCard from "@/components/ProductCard";
import ProductDetails from "@/components/ProductDetails";
import SponsorCard from "@/components/SponsorCard";
import { apiPlugin, storyblokInit } from "@storyblok/react/rsc";
import Products from "@/components/ContentType/Products";

// storyblok SDK init.
export const getStoryblokApi = storyblokInit({
  accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN, //configure access token for the storyblok api, so that we can fetch data from storyblok.
  use: [apiPlugin], //to communicate with storyblok content delivery API
  apiOptions: {
    region: "eu",
  },
  // will map storyblok components to react components, so that storyblok can render the react components instead of the default html output.
  components: {
    // dashboard: Dashboard,
    page: Page,
    products: Products,
    Hero,
    Grid,
    LatestProducts,
    CategoryCard,
    ProductCard,
    SponsorCard,
    ProductDetails,
  },
});
