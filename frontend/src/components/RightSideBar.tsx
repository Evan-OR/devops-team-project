import { Box, Button, Paper } from '@mui/material';

const RightSideBar = () => {
  const testViteProxy = async () => {
    const req = await fetch('/api');
    const json = await req.json();

    console.log(json);
  };

  return (
    <Paper sx={{ width: '250px' }}>
      <Box p={1}>
        <Box>Other idk</Box>
        <Box>
          <Button variant="outlined" onClick={testViteProxy}>
            Proxy test
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default RightSideBar;
