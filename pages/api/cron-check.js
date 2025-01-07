import { get, set } from '@vercel/storage';
import Parser from 'rss-parser';
import mailgun from 'mailgun-js';

const parser = new Parser();
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

export default async function handler(req, res) {
  const subscriptions = await get('subscriptions') || [];

  const updatedSubscriptions = await Promise.all(
    subscriptions.map(async (sub) => {
      const feed = await parser.parseURL(sub.rssUrl);
      const newPosts = feed.items.filter((post) => new Date(post.pubDate) > new Date(sub.lastFetchedPostDate));

      if (newPosts.length > 0) {
        const emailContent = newPosts.map(post => `<li><a href="${post.link}">${post.title}</a></li>`).join('');
        await mg.messages().send({
          from: `RSS to Email <noreply@${process.env.MAILGUN_DOMAIN}>`,
          to: sub.email,
          subject: `New posts from ${feed.title}`,
          html: `<ul>${emailContent}</ul>`,
        });

        sub.lastFetchedPostDate = newPosts[0].pubDate;
      }
      return sub;
    })
  );

  await set('subscriptions', updatedSubscriptions);
  res.status(200).json({ message: 'RSS feeds checked and emails sent!' });
}