import { Box, Paper } from '@mui/material';
import Nav from './Nav';
import RightSideBar from './RightSideBar';
import { JSX } from 'react';

type DefaultLayoutProps = {
  mainComponent: JSX.Element;
};

const DefaultLayout = ({ mainComponent }: DefaultLayoutProps) => {
  return (
    <Box display={'flex'} justifyContent={'center'} gap={1}>
      <Nav />
      <Paper sx={{ width: '600px' }}>{mainComponent}</Paper>
      <RightSideBar />
    </Box>
  );
};

export default DefaultLayout;
