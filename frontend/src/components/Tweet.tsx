import { Avatar, Box, Divider, IconButton, Typography } from '@mui/material';
import { red, pink, purple, orange, yellow, green, lightBlue, lightGreen } from '@mui/material/colors';
import { Favorite, Edit } from '@mui/icons-material';

type TweetProps = {
  username: string;
  content: string;
  timestamp: string;
};

function Tweet({ username, content, timestamp }: TweetProps) {
  const randomIconColor = () => {
    const colors = [red, pink, purple, orange, yellow, green, lightBlue, lightGreen];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex][500];
  };

  return (
    <Box>
      <Box display={'flex'} gap={1} p={1}>
        <Box>
          <Avatar sx={{ backgroundColor: randomIconColor() }}>{username.charAt(0)}</Avatar>
        </Box>

        <Box width={'100%'}>
          <Box display={'flex'} flexDirection={'column'}>
            <Box>
              <Typography variant="subtitle1" fontWeight={'bold'} display={'inline'}>
                {username}
              </Typography>
              <Typography display={'inline'}> · {timestamp}</Typography>
            </Box>

            <Typography width={'100%'}>{content}</Typography>

            <Box display={'flex'} justifyContent={'space-between'}>
              <IconButton aria-label="Like">
                <Favorite />
              </IconButton>

              <IconButton aria-label="Like">
                <Edit />
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
