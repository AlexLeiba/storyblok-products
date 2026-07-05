import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Image from "next/image";

type CategoryType = {
  headline: string;
  type: string;
  image: {
    filename: string;
    alt: string;
  };
};
export default function CategoryCard({ blok }: { blok: CategoryType }) {
  return (
    <Card
      variant="elevation"
      sx={{ borderRadius: 2, overflow: "hidden", paddingX: 2, paddingY: 1 }}
    >
      <Typography variant="h5" component="h3">
        {blok.headline}
      </Typography>
      <Typography>{blok.type}</Typography>
      <Image
        src={blok.image.filename}
        alt={blok.image.alt}
        width={500}
        height={500}
        style={{ objectFit: "cover", width: "100%", height: "200px" }}
      />
    </Card>
  );
}
