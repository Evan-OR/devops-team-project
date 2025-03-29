import { Box, Button, Divider, Input, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { login, register } from '../utils/requests';
import { useNavigate } from 'react-router-dom';

const LoginRegister = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [signInType, setSignInType] = useState<'login' | 'register'>('register');
  const [inputData, setInputData] = useState({ email: '', username: '', password: '' });

  const handleInputData = (input: 'email' | 'username' | 'password', newValue: string) => {
    setInputData((prev) => ({ ...prev, [input]: newValue }));
  };

  const toggleSignInType = () => {
    signInType === 'login' ? setSignInType('register') : setSignInType('login');
  };

  const reqFunction = () => {
    const { email, username, password } = inputData;

    if (!username || !password || (signInType === 'register' && !email)) return;

    const funcs = {
      login: () => login(username, password),
      register: () => register(email, username, password),
    };
    try {
      funcs[signInType]();
      navigate('/');
    } catch (err) {
      console.error(err);
      console.error('IDK');
    }
  };

  const { questionText, linkText, buttonText } = {
    ...(signInType === 'login'
      ? {
          questionText: 'New User?',
          linkText: 'Create Account',
          buttonText: 'Log In',
        }
      : {
          questionText: 'Already have an account?',
          linkText: 'Sign In',
          buttonText: 'Register',
        }),
  };

  return (
    <Box display={'flex'}>
      <Divider flexItem orientation="vertical" />
      <Box width={'100%'}>
        <Box>
          <Typography variant="h6" p={1}>
            Sign In
          </Typography>
          <Divider />

          <Box display="flex" flexDirection="column" alignItems={'center'} p={2} gap={3}>
            {signInType === 'register' && (
              <Input
                sx={{ width: '50%' }}
                multiline
                placeholder="email"
                value={inputData.email}
                onChange={(e) => handleInputData('email', e.target.value)}
                fullWidth
              />
            )}

            <Input
              sx={{ width: '50%' }}
              multiline
              placeholder="username"
              value={inputData.username}
              onChange={(e) => handleInputData('username', e.target.value)}
              fullWidth
            />

            <Input
              sx={{ width: '50%' }}
              multiline
              placeholder="password"
              value={inputData.password}
              onChange={(e) => handleInputData('password', e.target.value)}
              fullWidth
            />

            <Button onClick={reqFunction} sx={{ width: '50%' }} variant="contained" fullWidth>
              {buttonText}
            </Button>

            <Box>
              <Typography component={'span'}>{questionText} </Typography>
              <span
                style={{ display: 'inline', color: theme.palette.primary.main, cursor: 'pointer' }}
                onClick={toggleSignInType}
              >
                <Typography component={'span'}>{linkText}</Typography>
              </span>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider flexItem orientation="vertical" />
    </Box>
  );
};

export default LoginRegister;
