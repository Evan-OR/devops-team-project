import { Box, Divider, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Tweet from './Tweet';
import PostComponent from './PostComponent';

interface TweetType {
  id: number;
  username: string;
  content: string;
  created_at: string;
}

const TweetsWrapper = () => {
  const [tweets, setTweets] = useState<TweetType[]>([]);

  // Fetch tweets from the backend
  const fetchTweets = async () => {
    console.log('Fetching tweets...');
    try {
      const res = await fetch('http://localhost:3002/api/tweets');
      const data = await res.json();
      console.log('Fetched tweets:', data);
      setTweets(data);
    } catch (err) {
      console.error('Failed to fetch tweets:', err);
    }
  };

  // Fetch once on component mount
  useEffect(() => {
    fetchTweets();
  }, []);

  const formatRelativeTime = (isoDate: string): string => {
    const date = new Date(isoDate);
    const secondsAgo = Math.floor((Date.now() - date.getTime()) / 1000);

    if (secondsAgo < 60) return `${secondsAgo}s`;
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h`;
    return date.toLocaleDateString();
  };

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

          {/* refresh callback to PostComponent */}
          <PostComponent onTweetPosted={fetchTweets} />

          {/* Tweets rendered Dynamically */}
          {tweets.map((tweet) => (
            <Tweet
              key={tweet.id}
              username={tweet.username}
              content={tweet.content}
              timestamp={formatRelativeTime(tweet.created_at)}
            />
          ))}
        </Box>
        <Divider flexItem orientation="vertical" />
      </Box>
    </Paper>
  );
};

export default TweetsWrapper;
