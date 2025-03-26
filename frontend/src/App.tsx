import { Box } from '@mui/material';
import TweetsWrapper from './components/TweetsWrapper';
import Nav from './components/Nav';
import RightSideBar from './components/RightSideBar';

function App() {
  return (
    <Box display={'flex'} justifyContent={'center'} gap={1}>
      <Nav />
      <TweetsWrapper />
      <RightSideBar />
    </Box>
  );
}

export default App;
