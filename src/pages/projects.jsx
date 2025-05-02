import Image from 'next/image'
import Head from 'next/head'
import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { useState, useEffect } from 'react'
import Link from 'next/link'

// Import icons from react-icons
import { 
  FaReact, FaJava, FaPython, FaNodeJs, FaMobile, 
  FaCode, FaServer, FaCalendarAlt 
} from 'react-icons/fa'
import { 
  SiFlutter, SiDjango, SiTypescript, 
  SiOpenai, SiGooglechrome, SiSwift, 
} from 'react-icons/si'
import { GiArtificialIntelligence } from 'react-icons/gi'

const projects = [
  {
    name: 'Applify AI',
    description:
      'AI-Powered Resume Tailoring Platform using TypeScript, Next.js, and OpenAI that optimizes resumes for ATS systems and human recruiters. Features include secure authentication, intelligent content generation, and subscription-based premium features.',
    link: { href: 'https://applify-ai.com/', label: 'applify-ai.com' },
    github: 'https://github.com/kianis4/applify-ai',
    logo: '/ApplifyLogo.svg', // Updated to use public directory path
    timeframe: 'Feb 2025 - Present',
    tech: ['TypeScript', 'Next.js', 'MongoDB', 'OpenAI', 'Stripe'],
    featured: true,
  },
  {
    name: 'SKompXcel',
    description:
      'Academic Excellence Platform and mentorship service supporting 20+ Computer Science students. Built with Next.js and TypeScript, featuring responsive UI with Tailwind CSS and scalable hosting on Google Cloud.',
    link: { href: 'https://skompxcel.com/', label: 'skompxcel.com' },
    logo: '/SKompLightMode.svg', // Updated to use public directory path
    timeframe: 'Jan 2024 - Present',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Google Cloud'],
    featured: true,
  },
  {
    name: 'Interactive Fitness Portfolio',
    description:
      'Personal portfolio platform showcasing fitness achievements using Next.js and Tailwind CSS. Features Instagram and Spotify API integrations, optimized performance through SSR, and reusable React components.',
    link: { href: 'https://suleyman.io/', label: 'Personal Portfolio' },
    logo: <FaReact className="text-blue-500" />, // React icon
    timeframe: 'Oct 2024 - May 2025',
    tech: ['Next.js', 'React', 'Tailwind CSS', 'API Integration'],
  },
  {
    name: 'Full Stack Recipe Management',
    description: 
      'Comprehensive recipe management system with advanced search features, responsive UI, and flexible data storage. Built with React frontend and Django REST Framework backend to handle 300+ ingredients.',
    link: { href: 'https://github.com/kianis4/RecipeShack', label: 'GitHub' },
    logo: <SiDjango className="text-green-700" />, // Django icon
    timeframe: 'Mar 2023 - Apr 2025',
    tech: ['React', 'Django', 'MongoDB', 'Chakra UI'],
  },
  {
    name: 'Workout Tracking App',
    description:
      'Cross-platform application for tracking progressive overload in weightlifting. Built with Flutter using BLoC pattern for state management, Firebase for real-time sync, and automated testing with GitHub Actions.',
    link: { href: 'https://github.com/kianis4/workout_tracker', label: 'GitHub' },
    logo: <SiFlutter className="text-blue-400" />, // Flutter icon
    timeframe: 'Apr 2024 - Apr 2025',
    tech: ['Flutter', 'Dart', 'Firebase', 'BLoC'],
  },
  {
    name: 'Interactive Portfolio Platform',
    description:
      'Modern personal portfolio with advanced GSAP animations, responsive SASS-based design, serverless contact form with EmailJS, and interactive map integrations.',
    link: { href: 'https://github.com/kianis4/Personal-CV', label: 'GitHub' },
    logo: <FaCode className="text-purple-600" />, // Code icon
    timeframe: 'Feb 2023 - Apr 2025',
    tech: ['React', 'GSAP', 'SASS', 'EmailJS'],
  },
  {
    name: 'Portfolio Backend API',
    description:
      'Comprehensive backend API for personal portfolio with social media integration. Features JWT authentication, MongoDB with GridFS, and external API integrations for Instagram and Chess.com.',
    link: { href: 'https://github.com/kianis4/Personal-CV-Backend', label: 'GitHub' },
    logo: <FaNodeJs className="text-gray-600" />, // Server icon
    timeframe: 'May 2023 - Apr 2025',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'JWT'],
  },
  {
    name: 'Crime Analysis System',
    description:
      'Desktop application for analyzing NYC crime data across four million records. Implements spatial data analysis, Dijkstra\'s algorithm for safest paths, and LocationIQ API integration.',
    link: { href: 'https://github.com/kianis4/Saftey-Net', label: 'GitHub' },
    logo: <FaJava className="text-blue-700" />, // Desktop icon
    timeframe: 'Mar 2023 - Apr 2025',
    tech: ['Java SE 10', 'OpenCSV', 'Google Gson', 'LocationIQ API'],
  },
  {
    name: 'AI Course Chatbot',
    description:
      'Knowledge-based chatbot for answering AI course questions. Implements rule-based inference engine with backward chaining and structured knowledge representation.',
    link: { href: 'https://github.com/kianis4/AI-31-Chatbot', label: 'GitHub' },
    logo: <GiArtificialIntelligence className="text-teal-600" />, // AI icon
    timeframe: 'Mar 2025',
    tech: ['Python', 'Rule-Based Inference', 'CLI'],
  },
  {
    name: 'Load Balancing System',
    description:
      'Robust load balancer distributing client requests across multiple backend servers with health checks and multiple algorithms. Implements multi-threading for handling concurrent connections.',
    link: { href: 'https://github.com/kianis4/load-balancer', label: 'GitHub' },
    logo: <FaServer className="text-red-500" />, // Server icon with different color
    timeframe: 'Feb 2025',
    tech: ['Python 3', 'Sockets', 'Multi-threading'],
  },
  {
    name: 'AI Coding Interview Platform',
    description:
      'Web platform simulating coding interviews with generative AI. Features OpenAI GPT-4 integration, Docker-based code execution, and interactive chat interface.',
    link: { href: 'https://github.com/kianis4/SKompXcel-AI-Code-Mentor', label: 'GitHub' },
    logo: <SiOpenai className="text-green-500" />, // OpenAI icon
    timeframe: 'Feb 2025',
    tech: ['TypeScript', 'Next.js', 'Node.js', 'OpenAI GPT-4'],
  },
  {
    name: 'Calendar Application',
    description:
      'Personalized calendar app for daily notes and reflections. Built with Next.js, TypeScript, and React Calendar for an interactive experience.',
    link: { href: 'https://github.com/kianis4/birthday-calendar', label: 'GitHub' },
    logo: <FaCalendarAlt className="text-indigo-600" />, // Calendar icon
    timeframe: 'Dec 2024',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
  },
  {
    name: 'iOS Overload Management',
    description:
      'iOS application for system load management and optimization using MVVM architecture, Alamofire for network communication, and Core Data for local persistence.',
    link: { href: 'https://github.com/kianis4/overload-pro-ios', label: 'GitHub' },
    logo: <SiSwift className="text-orange-500" />, // Swift icon
    timeframe: 'Feb 2025',
    tech: ['Swift', 'UIKit', 'Core Data', 'MVVM'],
  },
  {
    name: 'Bigram Language Model',
    description:
      'Character-level language model using PyTorch. Implements tensor operations for training, sampling mechanisms for text generation, and negative log likelihood for loss evaluation.',
    link: { href: 'https://github.com/kianis4/torch-bigram-language-model', label: 'GitHub' },
    logo: <FaPython className="text-yellow-600" />, // Python icon
    timeframe: 'Jan 2025',
    tech: ['PyTorch', 'Tensor Operations', 'Model Training'],
  },
  {
    name: 'Neural Network Framework',
    description:
      'Educational framework demystifying neural network principles. Implements core components for automatic differentiation and gradient computation, recreating Micrograd functionality.',
    link: { href: 'https://github.com/kianis4/-neural-networks-zero-to-hero', label: 'GitHub' },
    logo: <GiArtificialIntelligence className="text-blue-600" />, // AI icon different color
    timeframe: 'Jan 2025',
    tech: ['Python', 'Jupyter Notebook', 'Micrograd'],
  },
  {
    name: 'Fitness Tracking App',
    description:
      'Mobile app for tracking progressive overload in fitness routines. Built with Swift and SwiftUI, using Core Data for persistent storage and Combine for async data handling.',
    link: { href: 'https://github.com/kianis4/ProgressiveOverloadApp', label: 'GitHub' },
    logo: <FaMobile className="text-red-600" />, // Fitness icon
    timeframe: 'Oct 2024',
    tech: ['Swift', 'SwiftUI', 'Core Data', 'Combine'],
  },
  {
    name: 'E&S Solns.',
    description:
      'Co-Founder and Lead Developer - Automation and software solutions for small businesses. Implementing digital transformation and custom workflow solutions.',
    link: { href: 'https://www.es-soln.com/', label: 'es-soln.com' },
    logo: <SiTypescript className="text-purple-500" />, // Services icon
    timeframe: '2023 - Present',
    tech: ['Web Development', 'Automation', 'Consulting'],
  },
  {
    name: 'Evergreen Renos',
    description: 
      'Web application streamlining operations for a renovation business in the GTA, enhancing customer experience and improving project management efficiency.',
    link: { href: 'https://www.evergreenrenos.ca/', label: 'evergreenrenos.ca' },
    logo: <SiGooglechrome className="text-green-600" />, // Web icon
    timeframe: '2023',
    tech: ['Web Development', 'CMS', 'Project Management'],
  },
]

function LinkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  )
}

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Projects() {
  // Separate featured projects from regular projects
  const featuredProjects = projects.filter(project => project.featured);
  const regularProjects = projects.filter(project => !project.featured);

  // Add state for search term
  const [searchTerm, setSearchTerm] = useState('');

  // Use search term to filter projects
  const filteredProjects = regularProjects.filter(project => {
    const techMatch = project.tech.some(tech => 
      tech.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const descriptionMatch = project.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const nameMatch = project.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    return techMatch || descriptionMatch || nameMatch || searchTerm === '';
  });

  // Add state for back to top button
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Get all unique technologies across projects
  const allTechnologies = [...new Set(
    projects.flatMap(project => project.tech)
  )].sort();

  return (
    <>
      <Head>
        <title>Suleyman Kiani | Projects</title>
        <meta
          name="description"
          content="Things I've made trying to put my dent in the universe."
        />
      </Head>
      <SimpleLayout
        title="Things I've made trying to put my dent in the universe."
        intro="I've worked on tons of little projects over the years but these are the ones that I'm most proud of. Many of them are open-source, so if you see something that piques your interest, check out the code and contribute if you have ideas for how it can be improved."
      >
        {/* Add project summary */}
        <div className="mb-12 flex flex-wrap justify-center gap-8 text-center">
          <div className="px-8 py-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{projects.length}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Projects</p>
          </div>
          
          <div className="px-8 py-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {projects.filter(p => p.tech.includes('Next.js')).length}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Next.js Projects</p>
          </div>
          
          <div className="px-8 py-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {projects.filter(p => p.github).length}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Open Source</p>
          </div>
        </div>
        
        {/* Featured Projects Section */}
        {featuredProjects.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-8">Featured Projects</h2>
            <ul
              role="list"
              className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 mb-16"
            >
              {featuredProjects.map((project) => (
                <Card 
                  as="li" 
                  key={project.name} 
                  className="border-2 border-blue-500/20 dark:border-blue-500/30 shadow-lg p-6 sm:p-8" // Added padding here
                >
                  {/* Improve the card header layout */}
                  <div className="flex flex-col">
                    {/* Logo section with proper spacing */}
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 mb-6">
                      {typeof project.logo === 'string' ? (
                        <Image
                          src={project.logo}
                          alt=""
                          className="h-8 w-8"
                          width={32}
                          height={32}
                          unoptimized
                        />
                      ) : (
                        <div className="h-8 w-8 flex items-center justify-center text-2xl">
                          {project.logo}
                        </div>
                      )}
                    </div>
                    
                    {/* Project title and timeframe with better spacing */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
                        <Card.Link href={project.link.href}>{project.name}</Card.Link>
                      </h2>
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30 mt-1 sm:mt-0">
                        {project.timeframe}
                      </span>
                    </div>
                  </div>
                  
                  <Card.Description>{project.description}</Card.Description>
                  
                  {/* Tech Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span 
                        key={tech}
                        className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-900/10 dark:bg-zinc-800/40 dark:text-zinc-300 dark:ring-zinc-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="relative z-10 mt-6 flex items-center gap-4">
                    <p className="flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
                      <LinkIcon className="h-6 w-6 flex-none" />
                      <span className="ml-2">{project.link.label}</span>
                    </p>
                    
                    {project.github && (
                      <a 
                        href={project.github} 
                        className="flex text-sm font-medium text-zinc-400 transition hover:text-zinc-800 dark:text-zinc-200 dark:hover:text-zinc-50"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GitHubIcon className="h-6 w-6 flex-none" />
                        <span className="ml-2">GitHub</span>
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </ul>
          </>
        )}
        
        {/* Replace the existing category filter with this search-based filter */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">More Projects</h2>
          
          {/* Search box */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type="search"
              className="block w-full p-4 pl-10 text-sm border rounded-lg bg-zinc-50 border-zinc-300 text-zinc-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search projects by name, tech, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 bottom-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2"
              >
                Clear
              </button>
            )}
          </div>
          
          {/* Popular technologies pills (optional) */}
          <div className="flex flex-wrap gap-2 mb-6">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mr-2 self-center">Popular:</p>
            {allTechnologies.slice(0, 5).map(tech => (
              <button
                key={tech}
                onClick={() => setSearchTerm(tech)}
                className="px-3 py-1.5 text-sm font-medium rounded-md bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition"
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
        
        {/* Search results count */}
        <div className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          {searchTerm ? (
            <p>Found {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} matching &ldquo;{searchTerm}&rdquo;</p>
          ) : (
            <p>Showing all {regularProjects.length} projects</p>
          )}
        </div>
        
        {/* Use filtered projects instead */}
        <ul
          role="list"
          className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project) => (
            <Card 
              as="li" 
              key={project.name} 
              className="group hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-600"
            >
              {/* Logo with hover effect */}
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 group-hover:scale-110 transition-transform duration-300">
                {typeof project.logo === 'string' ? (
                  <Image
                    src={project.logo}
                    alt=""
                    className="h-8 w-8"
                    width={32}
                    height={32}
                    unoptimized
                  />
                ) : (
                  <div className="h-8 w-8 flex items-center justify-center text-2xl">
                    {project.logo}
                  </div>
                )}
              </div>
              
              {/* Project header with improved hierarchy */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6">
                <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Card.Link href={project.link.href}>{project.name}</Card.Link>
                </h2>
                <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10 dark:bg-zinc-700/40 dark:text-zinc-300 dark:ring-zinc-700 mt-1 sm:mt-0">
                  {project.timeframe}
                </span>
              </div>
              
              <Card.Description>{project.description}</Card.Description>
              
              {/* Tech Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span 
                    key={tech}
                    className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10 dark:bg-zinc-800/40 dark:text-zinc-300 dark:ring-zinc-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="relative z-10 mt-6 flex items-center gap-4">
                <p className="flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
                  <LinkIcon className="h-6 w-6 flex-none" />
                  <span className="ml-2">{project.link.label}</span>
                </p>
                
                {project.github && (
                  <a 
                    href={project.github} 
                    className="flex text-sm font-medium text-zinc-400 transition hover:text-zinc-800 dark:text-zinc-200 dark:hover:text-zinc-50"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitHubIcon className="h-6 w-6 flex-none" />
                    <span className="ml-2">GitHub</span>
                  </a>
                )}
              </div>
            </Card>
          ))}
        </ul>
        
        {/* Show message when no projects match filter */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">
              No projects found matching the selected filter.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Show all projects
            </button>
          </div>
        )}
      </SimpleLayout>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed right-8 bottom-8 p-3 rounded-full bg-blue-600 text-white shadow-lg transition-opacity ${
          showBackToTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

            {/* Applify AI Banner */}
            <div className="fixed bottom-4 right-4 z-50">
        <Link 
          href="/projects" 
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
            <Image 
              src="/ApplifyLogo.svg" 
              alt="Applify AI Logo" 
              width={24} 
              height={24}
              className="object-cover"
            />
          </div>
          <span className="text-xs font-medium pr-1">
            Built using Applify AI — <span className="underline group-hover:no-underline">My Latest Project</span>
          </span>
        </Link>
      </div>
    </>
  )
}
