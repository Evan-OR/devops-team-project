import { Avatar, Box, Button, Divider, Input } from '@mui/material';

import { blue } from '@mui/material/colors';

const PostComponent = () => {
  return (
    <Box>
      <Box display={'flex'} gap={1} p={1}>
        <Box>
          <Avatar sx={{ backgroundColor: blue[500] }}>U</Avatar>
        </Box>

        <Box width={'100%'}>
          <Box display={'flex'} flexDirection={'column'}>
            <Input multiline placeholder="What happening" />

            <Box display={'flex'} justifyContent={'flex-end'} m={1}>
              <Button variant="contained">Post</Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider orientation="horizontal" />
    </Box>
  );
};

export default PostComponent;
