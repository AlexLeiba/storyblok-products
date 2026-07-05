import { StoryblokStory, getStoryblokApi } from "@storyblok/react/rsc";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

// main story page ( where we fetch story based on slug and pass to StoryblokStory component to render the story)
// "content" object contains "component":"page" which will receive this story

async function fetchDashboardData() {
  const client = getStoryblokApi();

  const response = await client.getStory(`/dashboard`, {
    version: process.env.NODE_ENV === "development" ? "draft" : "published", //after next dev command ( the NODE_ENV will be development, after next build and next start command the NODE_ENV will be production), so we can use this to determine if we want to fetch draft or published content.

    // resolve_relations: "Recommendet_tours.tours", //linked content is returned ( [ids,ids,ids])(relatiopn fields only contain uuid of the references story), and Stoiryblok will auto fetch those linked stories will replace uuid with actyual story oibj.

    resolve_relations: "LatestProducts.products", //giving a strings which defined the structure of the relation field, so that storyblok will fetch the linked stories and replace the uuid with actual story object. (this is a comma separated list of relation fields, if we have multiple relation fields we can pass them as comma separated list)
  });

  return response.data.story;
}

export default async function Dashboard() {
  const data = await fetchDashboardData();
  console.log("🚀 ~ Dashboard ~ data:", data);

  // console.log("🚀 ~ Dashboard ~ data:", data);
  // passing entire story to StoryBlokStory (contains name and slug)

  return <StoryblokStory story={data} />;
}
