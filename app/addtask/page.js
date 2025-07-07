'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, getAISuggestions, postTask } from '/utils/api';

export default function AddTaskPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priorityScore, setPriorityScore] = useState(null);
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [aiRaw, setAiRaw] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    getCategories().then(res => setCategories(res.data));
  }, []);

  const parseAISuggestion = (text) => {
    const lines = text.split('\n');
    const data = {};
    lines.forEach(line => {
      if (line.toLowerCase().includes('priority')) {
        const num = line.match(/\d+/);
        if (num) data.priority_score = parseInt(num[0]);
      } else if (line.toLowerCase().includes('deadline')) {
        data.deadline = line.split(':').slice(1).join(':').trim();
      } else if (line.toLowerCase().includes('description')) {
        data.description = line.split(':').slice(1).join(':').trim();
      } else if (line.toLowerCase().includes('category')) {
        data.category = line.split(':').slice(1).join(':').trim();
      }
    });
    return data;
  };

  const parseDeadline = (text) => {
    const parsed = Date.parse(text);
    return isNaN(parsed) ? null : new Date(parsed).toISOString();
  };

  const handleAISuggest = async () => {
    setLoading(true);
    try {
      const res = await getAISuggestions({ task: title, context: description });
      const raw = res.data?.suggestion;
      setAiRaw(raw);

      const parsed = parseAISuggestion(raw);

      if (parsed.description) setDescription(parsed.description);
      if (parsed.priority_score) setPriorityScore(parsed.priority_score);
      if (parsed.deadline) setDeadline(parsed.deadline);
      if (parsed.category) setCategory(parsed.category);
    } catch (err) {
      alert('❌ AI suggestion failed');
      console.error(err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const matchedCategory = categories.find(
      (cat) => cat.name.toLowerCase() === category.toLowerCase()
    );

    const taskData = {
      title,
      description,
      priority_score: priorityScore,
      deadline: parseDeadline(deadline),
      category: matchedCategory ? matchedCategory.id : null,
    };

    try {
      await postTask(taskData);
      alert('✅ Task added!');
      router.push('/');
    } catch (err) {
      alert('❌ Failed to add task');
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          ➕ Add New Task
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Title</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {deadline && (
            <p className="text-sm text-gray-700">🕒 AI Suggested Deadline: {deadline}</p>
          )}
          {priorityScore !== null && (
            <p className="text-sm text-gray-700">🔥 Priority Score: {priorityScore}</p>
          )}
          {category && (
            <p className="text-sm text-gray-700">📂 Category: {category}</p>
          )}

          <div className="flex flex-wrap gap-3 mt-3">
            <button
              type="button"
              onClick={handleAISuggest}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:shadow-md transition"
              disabled={loading}
            >
              {loading ? 'Generating...' : '💡 AI Suggest'}
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 hover:shadow-md transition"
            >
              ✅ Add Task
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-gray-600 hover:underline ml-auto"
            >
              ← Back to Dashboard
            </button>
          </div>

          {aiRaw && (
            <div className="bg-gray-100 border border-gray-300 rounded p-4 mt-4 text-sm text-black whitespace-pre-wrap break-words animate-fade-in">
              <strong className="text-red-700 block mb-2">Raw AI Suggestion:</strong>
              <pre className="whitespace-pre-wrap">{aiRaw}</pre>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}