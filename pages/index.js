import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [rssUrl, setRssUrl] = useState('');
  const [message, setMessage] = useState('');

  const subscribe = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, rssUrl }),
    });

    const result = await response.json();
    setMessage(result.message || result.error);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="p-8 bg-gray-800 rounded shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4">RSS to Email</h1>
        <form onSubmit={subscribe}>
          <input
            type="url"
            placeholder="RSS Feed URL"
            value={rssUrl}
            onChange={(e) => setRssUrl(e.target.value)}
            className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
            required
          />
          <button
            type="submit"
            className="w-full p-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
          >
            Subscribe
          </button>
        </form>
        {message && <p className="mt-4">{message}</p>}
      </div>
    </div>
  );
}