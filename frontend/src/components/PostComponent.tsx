import { Avatar, Box, Button, Divider, Input } from '@mui/material';
import { blue } from '@mui/material/colors';
import React, { useState } from 'react';

interface Props {
  onTweetPosted?: () => void; // refresh callback
}

const PostComponent: React.FC<Props> = ({ onTweetPosted }) => {
  const [content, setContent] = useState('');

  const handlePost = async () => {
    if (!content.trim()) return;

    try {
      const response = await fetch('/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          creator_id: 1,
        }),
      });

      if (!response.ok) {
        console.error('Failed to post tweet');
        return;
      }

      console.log('Tweet posted successfully');
      setContent('');
      onTweetPosted?.();
    } catch (error) {
      console.error('Error posting tweet:', error);
    }
  };

  return (
    <Box>
      <Box display={'flex'} gap={1} p={1}>
        <Box>
          <Avatar sx={{ backgroundColor: blue[500] }}>U</Avatar>
        </Box>

        <Box width={'100%'}>
          <Box display={'flex'} flexDirection={'column'}>
            <Input
              multiline
              placeholder="Whats happening"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
            />

            <Box display={'flex'} justifyContent={'flex-end'} m={1}>
              <Button variant="contained" onClick={handlePost}>
                Post
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider orientation="horizontal" />
    </Box>
  );
};

export default PostComponent;
