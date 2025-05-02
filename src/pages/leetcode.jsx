import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LeetcodeCalendar from '../components/LeetcodeCalendar';
import avatarImage from '../images/avatar.jpeg';
import Image from 'next/image';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { SiLeetcode } from 'react-icons/si';
import { FaGithub, FaLinkedin, FaMapMarkerAlt, FaUniversity, FaTrophy, FaCode } from 'react-icons/fa';
import { BiCodeAlt } from 'react-icons/bi';
import { HiOutlineStatusOnline } from 'react-icons/hi';

export default function LeetCodeStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await fetch('/api/leetcode');
        if (!response.ok) {
          throw new Error('Failed to fetch LeetCode stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching LeetCode stats:', err);
        setError('Failed to load LeetCode data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Prepare data for pie chart
  const getPieData = () => {
    if (!stats) return [];

    return [
      { name: 'Easy', value: stats.easySolved, color: '#00B8A3' },
      { name: 'Medium', value: stats.mediumSolved, color: '#FFC01E' },
      { name: 'Hard', value: stats.hardSolved, color: '#FF375F' },
    ];
  };

  const getTotalProgress = () => {
    if (!stats) return 0;
    return Math.round((stats.totalSolved / stats.totalQuestions) * 100);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-5xl animate-pulse">
        <div className="flex justify-center mb-6">
          <div className="h-10 bg-gray-300 dark:bg-zinc-700 rounded w-64"></div>
        </div>
        
        {/* Profile card skeleton */}
        <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-zinc-700"></div>
            <div className="space-y-3 w-full">
              <div className="h-7 bg-gray-300 dark:bg-zinc-700 rounded w-40"></div>
              <div className="h-5 bg-gray-300 dark:bg-zinc-700 rounded w-32"></div>
              <div className="h-5 bg-gray-300 dark:bg-zinc-700 rounded w-48"></div>
              <div className="h-5 bg-gray-300 dark:bg-zinc-700 rounded w-56"></div>
              <div className="h-5 bg-gray-300 dark:bg-zinc-700 rounded w-64"></div>
            </div>
          </div>
        </div>
        
        {/* Stats grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-800 shadow-lg rounded-xl p-6">
              <div className="h-6 bg-gray-300 dark:bg-zinc-700 rounded w-48 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-5 bg-gray-300 dark:bg-zinc-700 rounded w-full"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-96">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg max-w-md border border-red-100 dark:border-red-900/50">
          <div className="flex items-center mb-4">
            <SiLeetcode className="text-red-500 dark:text-red-400 text-3xl mr-3" />
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-300">Error Loading Data</h2>
          </div>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 max-w-5xl"
    >
      {/* Header Section */}
      <div className="relative mb-10 text-center">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        >
          <div className="inline-flex items-center justify-center mb-2">
            <SiLeetcode className="text-[#FFA116] text-4xl mr-3" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-zinc-100">
              LeetCode Profile
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Track my problem-solving journey with detailed statistics and recent submissions
          </p>
        </motion.div>
      </div>

      {/* Developer Insight Dialog for Recruiters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/30 dark:to-blue-900/30 mb-8 rounded-xl border border-teal-100 dark:border-teal-800/50 overflow-hidden"
      >
        <div className="p-5 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-shrink-0 p-3 bg-teal-500/10 dark:bg-teal-500/20 rounded-full">
              <svg className="w-8 h-8 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-1">API Integration Showcase</h3>
              <p className="text-gray-600 dark:text-zinc-300 text-sm md:text-base">
                This page demonstrates how complex UIs can be recreated using third-party APIs. The LeetCode calendar was particularly 
                challenging, requiring custom rendering of contribution data. I&apos;ve built this to show how 
                I approach API integration challenges and transform raw data into meaningful visualizations.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs md:text-sm">
            <div className="flex items-center bg-white/50 dark:bg-zinc-800/50 p-2 rounded-md">
              <div className="h-3 w-3 rounded-full bg-teal-500 mr-2"></div>
              <span className="text-gray-700 dark:text-zinc-300">API Data Transformation</span>
            </div>
            <div className="flex items-center bg-white/50 dark:bg-zinc-800/50 p-2 rounded-md">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-gray-700 dark:text-zinc-300">Custom Visualization Components</span>
            </div>
            <div className="flex items-center bg-white/50 dark:bg-zinc-800/50 p-2 rounded-md">
              <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-gray-700 dark:text-zinc-300">Performance Optimization</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* User Profile Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-white dark:bg-zinc-800/90 shadow-xl rounded-xl p-6 mb-8 backdrop-blur-sm border border-gray-100 dark:border-zinc-700/50"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
          {/* Avatar with shine effect */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-teal-500/20 dark:ring-teal-400/20 shadow-lg">
              <Image
                src={avatarImage}
                alt="Profile avatar"
                className="rounded-full object-cover"
                width={112}
                height={112}
                priority
              />
            </div>
            <div className="absolute -top-2 -right-2 bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200 text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
              <HiOutlineStatusOnline className="mr-1" />
              Active
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="text-center sm:text-left flex-grow">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-zinc-100">Suleyman</h2>
            <div className="inline-flex items-center text-gray-500 dark:text-zinc-400 text-lg mt-1">
              <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-0.5 rounded-md text-sm font-medium">@kianis4</span>
            </div>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4 text-sm">
              <div className="flex items-center text-gray-700 dark:text-zinc-300">
                <FaMapMarkerAlt className="mr-2 text-gray-500 dark:text-zinc-400" />
                Canada
              </div>
              <div className="flex items-center text-gray-700 dark:text-zinc-300">
                <FaUniversity className="mr-2 text-gray-500 dark:text-zinc-400" />
                McMaster University
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
              <a 
                href="https://github.com/kianis4" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700/50 dark:hover:bg-zinc-700 rounded-full text-sm transition-colors duration-200"
              >
                <FaGithub className="mr-2" />
                GitHub
              </a>
              <a 
                href="https://www.linkedin.com/in/suleyman-kiani/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700/50 dark:hover:bg-zinc-700 rounded-full text-sm transition-colors duration-200"
              >
                <FaLinkedin className="mr-2" />
                LinkedIn
              </a>
              <a 
                href="https://leetcode.com/kianis4" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center px-3 py-1.5 bg-[#FFA116]/10 hover:bg-[#FFA116]/20 text-[#FFA116] dark:bg-[#FFA116]/20 dark:hover:bg-[#FFA116]/30 rounded-full text-sm transition-colors duration-200"
              >
                <SiLeetcode className="mr-2" />
                View on LeetCode
              </a>
              <div className="flex items-center px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
                <FaTrophy className="mr-2" />
                Rank: {stats.ranking.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Overall Progress */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white dark:bg-zinc-800/90 shadow-lg rounded-xl p-6 backdrop-blur-sm border border-gray-100 dark:border-zinc-700/50"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-zinc-100 flex items-center mb-4">
            <BiCodeAlt className="mr-2 text-teal-500 dark:text-teal-400" />
            Overall Progress
          </h2>
          
          {/* Progress circle */}
          <div className="flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <svg className="w-40 h-40">
                <circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  fill="none" 
                  stroke="#e5e7eb" 
                  strokeWidth="10" 
                  className="dark:opacity-20"
                />
                <circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  fill="none" 
                  stroke="#0D9488" 
                  strokeWidth="10" 
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - getTotalProgress()/100)}`}
                  transform="rotate(-90 80 80)"
                  className="transition-all duration-1000 ease-out"
                />
                <text 
                  x="80" 
                  y="80" 
                  fontFamily="monospace" 
                  fontSize="24" 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  fill="currentColor"
                  className="text-gray-800 dark:text-zinc-100 font-bold"
                >
                  {getTotalProgress()}%
                </text>
              </svg>
            </div>
          </div>
          
          <div className="text-center mt-2">
            <p className="text-xl font-semibold text-gray-700 dark:text-zinc-200">
              {stats.totalSolved} / {stats.totalQuestions}
            </p>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              problems solved
            </p>
          </div>
        </motion.div>

        {/* Problems by Difficulty */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white dark:bg-zinc-800/90 shadow-lg rounded-xl p-6 backdrop-blur-sm border border-gray-100 dark:border-zinc-700/50"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-zinc-100 flex items-center mb-4">
            <FaCode className="mr-2 text-teal-500 dark:text-teal-400" />
            By Difficulty
          </h2>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 30, right: 30, bottom: 20, left: 30 }}>
                <Pie
                  data={getPieData()}
                  cx="50%"
                  cy="50%"
                  labelLine={{ 
                    stroke: "#666", 
                    strokeWidth: 1,
                    strokeOpacity: 0.5,
                    length: 10
                  }}
                  outerRadius={60}
                  innerRadius={0}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value, cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius + 20;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        fill={getPieData()[index].color}
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        fontWeight="bold"
                        fontSize="12"
                      >
                        {`${name}: ${value}`}
                      </text>
                    );
                  }}
                  animationDuration={1000}
                  paddingAngle={2}
                >
                  {getPieData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Problems`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-around mt-4">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-[#00B8A3] mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-zinc-300">Easy: {stats.easySolved}/{stats.totalEasy}</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-[#FFC01E] mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-zinc-300">Medium: {stats.mediumSolved}/{stats.totalMedium}</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-[#FF375F] mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-zinc-300">Hard: {stats.hardSolved}/{stats.totalHard}</span>
            </div>
          </div>
        </motion.div>

        {/* Profile Details */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white dark:bg-zinc-800/90 shadow-lg rounded-xl p-6 backdrop-blur-sm border border-gray-100 dark:border-zinc-700/50"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-zinc-100 mb-4 flex items-center">
            <SiLeetcode className="mr-2 text-teal-500 dark:text-teal-400" />
            Profile Stats
          </h2>
          
          <ul className="space-y-3">
            <li className="flex justify-between border-b border-gray-100 dark:border-zinc-700/50 pb-2">
              <span className="text-gray-600 dark:text-zinc-400">Ranking:</span>
              <span className="font-semibold text-gray-800 dark:text-zinc-200">{stats.ranking.toLocaleString()}</span>
            </li>
            <li className="flex justify-between border-b border-gray-100 dark:border-zinc-700/50 pb-2">
              <span className="text-gray-600 dark:text-zinc-400">Contribution Points:</span>
              <span className="font-semibold text-gray-800 dark:text-zinc-200">{stats.contributionPoint}</span>
            </li>
            <li className="flex justify-between border-b border-gray-100 dark:border-zinc-700/50 pb-2">
              <span className="text-gray-600 dark:text-zinc-400">Reputation:</span>
              <span className="font-semibold text-gray-800 dark:text-zinc-200">{stats.reputation}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 dark:text-zinc-400">Acceptance Rate:</span>
              <span className="font-semibold text-gray-800 dark:text-zinc-200">
                {Math.round((stats.hardSolved + stats.mediumSolved + stats.easySolved) / stats.totalSolved * 100)}%
              </span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Activity Calendar */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="bg-white dark:bg-zinc-800/90 shadow-lg rounded-xl p-6 mb-8 backdrop-blur-sm border border-gray-100 dark:border-zinc-700/50"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-zinc-100 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-teal-500 dark:text-teal-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z"></path>
          </svg>
          Activity Calendar
        </h2>
        
        <div className="overflow-hidden rounded-lg">
          <LeetcodeCalendar />
        </div>
      </motion.div>

      {/* Recent Submissions */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-white dark:bg-zinc-800/90 shadow-lg rounded-xl p-6 backdrop-blur-sm border border-gray-100 dark:border-zinc-700/50"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-zinc-100 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-teal-500 dark:text-teal-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18z"></path>
          </svg>
          Recent Submissions
        </h2>
        
        <div className="space-y-4">
          {stats.recentSubmissions.map((submission, index) => {
            const submissionDate = new Date(submission.timestamp * 1000);
            const isAccepted = submission.statusDisplay.toLowerCase().includes('accepted');
            
            return (
              <motion.div 
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                className={`p-4 rounded-lg border ${
                  isAccepted 
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30' 
                    : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="mb-2 sm:mb-0">
                    <h3 className="font-medium text-gray-800 dark:text-zinc-100">{submission.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">
                      {submissionDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isAccepted 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                  }`}>
                    {submission.statusDisplay}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
