import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  getStoryblokApi,
  StoryblokStory,
  renderRichText,
} from "@storyblok/react/rsc";

async function getProduct(productSlug: string) {
  const client = getStoryblokApi();

  const response = await client.getStory(`/dashboard/products/${productSlug}`, {
    version: process.env.NODE_ENV === "development" ? "draft" : "published",
  });

  return response.data.story;
}
export default async function Product({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const productId = (await params).productId;
  //   fetch storyblok apis here

  const product = await getProduct(productId);

  return (
    <div>
      <StoryblokStory story={product} />
      {product.content.items.map((blok: any) => (
        <Box key={blok._uid} sx={{ border: "1px solid black", p: 2, mb: 2 }}>
          <Typography variant="h5" component="h3">
            {blok.title}
          </Typography>
          <Typography>{blok.type}</Typography>
          <div
            className="prose  max-w-none
                     prose-headings:font-bold
                     prose-a:text-blue-600
                     prose-img:rounded-lg"
            dangerouslySetInnerHTML={{
              __html: renderRichText(blok.description),
            }}
          ></div>
        </Box>
      ))}

      {/* <Typography variant="h5" component="h3">
        {product.content.component}
      </Typography> */}
    </div>
  );
}
