'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTasks } from '../utils/api';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getTasks()
      .then(res => setTasks(res.data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  const goToAddTask = () => router.push('/addtask');
  const goToContext = () => router.push('/context');

  const getPriorityColor = (score) => {
    if (score >= 8) return 'text-red-600 font-bold';
    if (score >= 5) return 'text-yellow-600 font-semibold';
    return 'text-green-600';
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📝 Smart Todo Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={goToAddTask}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              ➕ Add Task
            </button>
            <button
              onClick={goToContext}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              📄 Add Context
            </button>
          </div>
        </header>

        {tasks.length === 0 ? (
          <p className="text-gray-600 text-center">No tasks found. Click "Add Task" to create one.</p>
        ) : (
          <motion.ul
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {tasks.map((task) => (
              <motion.li
                key={task.id}
                className="p-4 bg-white border shadow-md rounded-xl hover:shadow-lg transition"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div className="flex justify-between items-start gap-2">
                  <h2 className="font-semibold text-xl text-gray-900">{task.title}</h2>
                  <span className={`text-sm ${getPriorityColor(task.priority_score)}`}>
                    🔥 Priority: {task.priority_score ?? 'N/A'}
                  </span>
                </div>

                <p className="text-gray-700 mt-1 whitespace-pre-wrap">{task.description}</p>

                <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-4">
                  {task.category?.name && (
                    <span className="inline-block bg-gray-200 px-2 py-1 rounded text-xs text-gray-800">
                      📂 {task.category.name}
                    </span>
                  )}
                  {task.deadline && (
                    <span>
                      📅 Deadline:{' '}
                      <strong className="text-gray-800">
                        {new Date(task.deadline).toLocaleDateString()}
                      </strong>
                    </span>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </main>
  );
}