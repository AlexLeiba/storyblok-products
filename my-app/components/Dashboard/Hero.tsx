import Typography from "@mui/material/Typography";
import { HeroType } from "../ContentType/Page";
import Image from "next/image";
import Box from "@mui/material/Box";

export default async function Hero({ blok }: { blok: HeroType }) {
  // console.log("🚀 ~ Hero ~ blok:", blok);
  //   mat ui 1 === 8px
  return (
    <Box sx={{ mt: 1 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h3" component="h1">
            {blok.headline}
          </Typography>

          <Typography variant="body1" component="p">
            {blok.description}
          </Typography>
        </Box>
        {blok.image.filename && (
          <Image
            src={blok.image.filename}
            alt={blok.image.filename}
            width={500}
            height={300}
            style={{ objectFit: "cover", width: "100%" }}
          />
        )}
      </Box>
    </Box>
  );
}
