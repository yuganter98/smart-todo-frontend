'use client';

import { useEffect, useState } from 'react';
import { getContextEntries, postContext } from '/utils/api';

export default function ContextPage() {
  const [contextList, setContextList] = useState([]);
  const [entry, setEntry] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContext();
  }, []);

  const fetchContext = async () => {
    const res = await getContextEntries();
    setContextList(res.data);
  };

  const handleAdd = async () => {
    if (!entry.trim()) return alert('Please enter some context.');
    setLoading(true);
    try {
      await postContext({ content: entry, source_type: 'note' });
      setEntry('');
      fetchContext();
      alert('✅ Context added!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to add context.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 text-black p-6 animate-fade-in">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">🧠 Add Daily Context</h1>

        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          rows={4}
          placeholder="Type message, email, note..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />

        <button
          onClick={handleAdd}
          disabled={loading}
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition disabled:opacity-50"
        >
          {loading ? 'Adding...' : '➕ Add Context'}
        </button>

        <h2 className="mt-8 text-lg font-semibold">📜 Context History</h2>
        <ul className="space-y-3 mt-3">
          {contextList.map((ctx) => (
            <li
              key={ctx.id}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm animate-fade-in"
            >
              <p className="text-black">{ctx.content}</p>
              <span className="text-xs text-gray-500 italic">Source: {ctx.source_type}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}