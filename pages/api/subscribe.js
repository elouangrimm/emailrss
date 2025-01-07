import { set } from '@vercel/storage';
import Parser from 'rss-parser';

const parser = new Parser();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, rssUrl } = req.body;
  if (!email || !rssUrl) return res.status(400).json({ error: 'Email and RSS URL are required' });

  try {
    const feed = await parser.parseURL(rssUrl);
    const subscription = { email, rssUrl, lastFetchedPostDate: new Date().toISOString() };
    await set(`subscription:${email}`, subscription);

    res.status(200).json({ message: `Subscribed to ${feed.title}!` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to subscribe to RSS feed' });
  }
}