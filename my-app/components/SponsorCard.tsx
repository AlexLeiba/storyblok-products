import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Image from "next/image";

type SponsorType = {
  name: string;
  image: {
    filename: string;
    alt: string;
  };
};
export default function SponsorCard({ blok }: { blok: SponsorType }) {
  return (
    <Card
      variant="elevation"
      sx={{ borderRadius: 2, overflow: "hidden", paddingX: 2, paddingY: 1 }}
    >
      <Typography variant="h5" component="h3">
        {blok.name}
      </Typography>
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
