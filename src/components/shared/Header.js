import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/The Dragon News.png";
import { getCurrentDate } from "@/utils/getCurrentDate";

const Header = () => {
  const currentDate = getCurrentDate();
  return (
    <Box className="w-full my-5">
      <Container className="flex flex-col items-center">
        <Link href="/">
          <Image
            src={logo}
            alt="Dragon News logo"
            priority
            sizes="100vw"
            style={{ width: "500px", height: "auto", display: "block" }}
          />
        </Link>
        <Typography
          variant="body2"
          color="gray"
          textAlign="center"
          className="my-2"
        >
          Journalism Without Fear or Favour
        </Typography>
        <Typography textAlign="center">{currentDate}</Typography>
      </Container>
    </Box>
  );
};

export default Header;
