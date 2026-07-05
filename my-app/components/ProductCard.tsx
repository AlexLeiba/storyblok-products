import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Image from "next/image";

type ProductType = {
  headline: string;
  type: string;
  image: {
    filename: string;
    alt: string;
  };
};
export default function ProductCard({ blok }: { blok: ProductType }) {
  return (
    <Card>
      <Typography variant="h5" component="h3">
        {blok.headline}
      </Typography>
      <Typography>{blok.type}</Typography>
      <Image
        src={blok.image.filename}
        alt={blok.image.alt}
        width={500}
        height={500}
      />
    </Card>
  );
}
