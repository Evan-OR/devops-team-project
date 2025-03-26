import { Box, Button, Paper } from '@mui/material';
import ChirperSVG from '../assets/ChirperSvg.svg';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

const Nav = () => {
  return (
    <Paper sx={{ width: '250px' }}>
      <Box p={1}>
        <Box>
          <img width={'50px'} src={ChirperSVG} />
        </Box>

        <Button startIcon={<HomeIcon />} color="inherit" fullWidth sx={{ justifyContent: 'left' }}>
          Home
        </Button>

        <Button startIcon={<PersonIcon />} color="inherit" fullWidth sx={{ justifyContent: 'left' }}>
          Profile
        </Button>

        <Button startIcon={<SettingsIcon />} color="inherit" fullWidth sx={{ justifyContent: 'left' }}>
          Settings
        </Button>
      </Box>
    </Paper>
  );
};

export default Nav;
