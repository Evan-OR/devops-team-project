import { Link } from 'react-router-dom';
import { Box, Button, Paper } from '@mui/material';
import ChirperSVG from '../assets/ChirperSvg.svg';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';

const Nav = () => {
  return (
    <Paper sx={{ width: '250px' }}>
      <Box p={1}>
        <Box>
          <img width={'50px'} src={ChirperSVG} />
        </Box>

        <Link to={'/'}>
          <Button startIcon={<HomeIcon />} color="inherit" fullWidth sx={{ justifyContent: 'left', color: 'white' }}>
            Home
          </Button>
        </Link>

        <Link to={'/auth'}>
          <Button startIcon={<PersonIcon />} fullWidth sx={{ justifyContent: 'left', color: 'white' }}>
            Sign in
          </Button>
        </Link>
      </Box>
    </Paper>
  );
};

export default Nav;
