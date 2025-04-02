import { Avatar, Box, Divider, IconButton, Typography } from "@mui/material";
import {
  red,
  pink,
  purple,
  orange,
  yellow,
  green,
  lightBlue,
  lightGreen,
} from "@mui/material/colors";
import { FavoriteBorder, Edit, Delete } from "@mui/icons-material";

type TweetProps = {
  id: number;
  username: string;
  content: string;
  timestamp: string;
  onDelete: () => void;
  likes: number;
  onLike: (id: number) => void;
};

function Tweet({
  id,
  username,
  content,
  timestamp,
  onDelete,
  likes,
  onLike,
}: TweetProps) {
  const randomIconColor = () => {
    const colors = [
      red,
      pink,
      purple,
      orange,
      yellow,
      green,
      lightBlue,
      lightGreen,
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex][500];
  };

  return (
    <Box>
      <Box display={"flex"} gap={1} p={1}>
        <Box>
          <Avatar sx={{ backgroundColor: randomIconColor() }}>
            {username.charAt(0)}
          </Avatar>
        </Box>

        <Box width={"100%"}>
          <Box display={"flex"} flexDirection={"column"}>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={"bold"}
                display={"inline"}
              >
                {username}
              </Typography>
              <Typography display={"inline"}> · {timestamp}</Typography>
            </Box>

            <Typography width={"100%"}>{content}</Typography>

            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                  aria-label="Like"
                  onClick={() => onLike(id)}
                  sx={{
                    transition: "color 0.2s ease-in-out",
                    "&:hover": {
                      color: "pink",
                    },
                  }}
                >
                  <FavoriteBorder />
                </IconButton>
                <Typography variant="body2">
                  {likes} {likes === 1 ? "Like" : "Likes"}
                </Typography>
              </Box>

              <IconButton aria-label="Edit">
                <Edit />
              </IconButton>

              <IconButton
                aria-label="Delete"
                onClick={onDelete}
                sx={{
                  transition: "color 0.2s ease-in-out",
                  "&:hover": {
                    color: "red",
                  },
                }}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider />
    </Box>
  );
}

export default Tweet;
