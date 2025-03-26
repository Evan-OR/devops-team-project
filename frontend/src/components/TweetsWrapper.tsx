import { Box, Divider, Paper, Typography } from '@mui/material';

import Tweet from './Tweet';
import PostComponent from './PostComponent';

const TweetsWrapper = () => {
  return (
    <Paper sx={{ width: '600px' }}>
      <Box display={'flex'}>
        <Divider flexItem orientation="vertical" />
        <Box width={'100%'}>
          <Box>
            <Typography variant="h6" p={1}>
              Home
            </Typography>
            <Divider />
          </Box>

          <PostComponent />

          <Tweet username="Evan" content="Love how this def isn't just Twitter Twitter!" timestamp="Now" />
          <Tweet username="Joe" content="I <3 Chirper" timestamp="30s" />
          <Tweet username="Jake" content="Fucking love workmans" timestamp="2m" />
          <Tweet username="Kevin" content="I'm such a player these days" timestamp="2m" />
        </Box>
        <Divider flexItem orientation="vertical" />
      </Box>
    </Paper>
  );
};

export default TweetsWrapper;
