# suleyman.io - Personal Portfolio

Welcome to my professional portfolio, a comprehensive full-stack application built with Next.js and Tailwind CSS. This project showcases not only my fitness journey and technical skills but serves as a testament to my ability to integrate complex technologies, solve challenging problems, and create seamless user experiences.

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Page Architecture](#page-architecture)
  - [Home Page](#home-page)
  - [About Page](#about-page)
  - [Projects Page](#projects-page)
  - [Resume Page](#resume-page)
  - [Articles System](#articles-system)
  - [Spotify Integration](#spotify-integration)
  - [Instagram Integration](#instagram-integration)
  - [LeetCode Dashboard](#leetcode-dashboard)
  - [Uses Page](#uses-page)
- [Technical Challenges & Solutions](#technical-challenges--solutions)
- [Performance Optimizations](#performance-optimizations)
- [Installation & Setup](#installation--setup)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This portfolio represents a significant engineering effort to create a cohesive platform that showcases both my technical abilities and personal interests. The application integrates multiple external APIs, implements complex interactive components, and delivers content across various mediums while maintaining performance and accessibility standards.

Key architectural decisions include:
- **Content Management**: MDX for articles with frontmatter metadata
- **Data Fetching Strategy**: Server-side rendering for SEO-critical content with client-side fetching for dynamic elements
- **Responsive Design**: Mobile-first approach using Tailwind CSS with custom components
- **Code Organization**: Feature-based organization with shared components
- **Performance**: Optimized asset loading, code splitting, and caching strategies

## Key Features

- **Responsive Design**: Fully responsive layout tested across devices and screen sizes
- **Dark Mode Support**: Complete theme system with persistent user preferences
- **Dynamic Content**: Real-time data from multiple API integrations
- **Content Management**: Markdown-based article system with custom layouts
- **PDF Rendering**: LaTeX compilation and PDF rendering for resume
- **Interactive UI Components**: Custom carousel, filterable project lists, and progressive UI behaviors
- **Performance Optimized**: Lighthouse score >90 across all metrics
- **SEO Friendly**: Structured data, meta tags, and optimized content
- **Accessibility**: WCAG compliance with keyboard navigation and screen reader support

## Technology Stack

### Core Technologies
- **Next.js**: Framework for SSR, SSG, and routing
- **React**: UI library for component-based architecture
- **Tailwind CSS**: Utility-first CSS framework for styling
- **JavaScript (ES6+)/TypeScript**: Type-safe, modern JavaScript

### Integration & Data
- **MDX**: For content management and article rendering
- **API Integration**: 
  - Spotify Web API with OAuth authentication
  - Instagram Graph API
  - LeetCode data aggregation
- **PDF.js/React-PDF**: PDF rendering for resume
- **LaTeX**: Resume generation system with server-side compilation

### Libraries & Tools
- **Framer Motion**: Advanced animations and transitions
- **React Icons**: SVG icon components
- **Axios**: HTTP client for API requests
- **useSwipeable**: Touch gesture handling for mobile experiences
- **Tailwind Typography**: Styled typography for MD/MDX content
- **Headless UI**: Unstyled, accessible UI components

### DevOps & Infrastructure
- **Vercel**: Hosting and continuous deployment
- **GitHub Actions**: CI/CD pipelines
- **ESLint/Prettier**: Code quality and formatting

## Page Architecture

### Home Page

The home page serves as a central hub that introduces visitors to my brand and provides navigation to key sections. Technical implementation includes:

- **Component Composition**: Modular section components with clear responsibility boundaries
- **Dynamic Content Loading**: Article previews fetched at build time using `getStaticProps`
- **Media Gallery**: Custom responsive grid with mixed media types (images and video)
- **Performance Optimization**: 
  - Responsive image loading with Next.js Image component
  - Video lazy loading with custom hooks
  - Conditional rendering for performance-intensive components

**Technical Challenge**: Creating a visually impressive yet performant media gallery that supports both images and video required careful implementation of loading strategies and responsive behavior.

**Solution**: Implemented a custom component that determines media type and applies appropriate loading strategies (lazy loading for below-the-fold content) while maintaining consistent styling across media types.

### About Page

The about page combines personal branding with professional information using:

- **Structured Layout**: Grid-based responsive layout that adjusts based on screen size
- **Component Reuse**: Social link components shared across the application
- **Dynamic Styling**: Conditional classes with Tailwind and clsx
- **Accessibility**: Semantic HTML structure with proper heading hierarchy

**Technical Challenge**: Creating a layout that effectively communicates professional identity while maintaining visual interest and responsiveness.

**Solution**: Implemented a responsive grid system that reorganizes content based on screen size, ensuring optimal reading experience across devices.

### Projects Page

The projects page showcases my technical work using:

- **Dynamic Filtering**: Client-side search and filtering system
- **Categorization**: Technology tag system for project classification
- **Interactive UI**: Animated card components with hover states
- **Responsive Grid**: Adaptive grid layout that adjusts column count based on screen size
- **Smooth Scrolling**: Custom back-to-top functionality with scroll behavior

**Technical Challenge**: Implementing an effective filtering system that allows users to quickly find relevant projects without page refreshes.

**Solution**: Created a client-side search system with debounced input that filters projects based on name, description, and technologies in real-time.

### Resume Page

The resume page features a sophisticated document generation and viewing system:

- **LaTeX Integration**: Server-side compilation of LaTeX resume source files
- **PDF Viewer**: Interactive PDF rendering with React components
- **Download Options**: Direct resume download functionality
- **Responsive Design**: Adaptive viewing experience across devices
- **Error Handling**: Graceful degradation when compilation fails

**Technical Challenge**: Creating a system that allows for professional-quality resume display and generation while maintaining a seamless user experience.

**Solution**: Implemented a custom LaTeX compilation service that generates PDF files from LaTeX source, with client-side rendering using the PDF.js library for viewing and interaction.

### Articles System

The articles section implements a full-featured blog system:

- **MDX Content**: MDX for writing articles with React component support
- **Frontmatter Support**: Metadata handling for titles, dates, and descriptions
- **Custom Layouts**: Article-specific layouts with consistent styling
- **RSS Feed Generation**: Automated RSS feed generation for content syndication
- **Progressive Enhancement**: Core content works without JavaScript
- **Date Formatting**: Localized date display

**Technical Challenge**: Creating a content management system that supports rich formatting, code snippets, and React components while maintaining performance.

**Solution**: Built a custom MDX processing pipeline that extracts metadata, processes content, and renders with appropriate layouts while supporting code syntax highlighting and embedded components.

### Spotify Integration

The Spotify integration showcases my music preferences using:

- **OAuth Authentication**: Secure authentication with Spotify's API
- **Data Fetching**: API requests for top tracks and artists
- **Category Switching**: Toggle between content types
- **Error States**: Comprehensive error handling with retry functionality
- **Loading States**: Skeleton loading UI during data fetches
- **Responsive Design**: Adaptive grid layout for different screen sizes

**Technical Challenge**: Implementing OAuth authentication and maintaining user sessions while securely accessing Spotify data.

**Solution**: Created a server-side authentication flow that securely manages tokens and refreshes, with client-side components that display data without exposing sensitive credentials.

### Instagram Integration

The Instagram carousel provides a visual glimpse into my fitness journey:

- **Custom Carousel**: Built from scratch with touch gesture support
- **Animation**: Smooth transitions using CSS and JavaScript
- **Swipe Gestures**: Mobile-friendly navigation with swipe detection
- **Lazy Loading**: Performance optimization for media loading
- **Error Handling**: Fallback UI when media can't be loaded
- **Browser Compatibility**: Detection and alternative experiences for incompatible browsers

**Technical Challenge**: Creating a performant, touch-friendly carousel component that works across devices while efficiently loading potentially large media files.

**Solution**: Implemented a custom carousel with touch event handling, progressive loading strategies, and hardware-accelerated animations for smooth performance even on mobile devices.

### LeetCode Dashboard

The LeetCode dashboard visualizes my problem-solving progress:

- **Data Aggregation**: Collection and processing of LeetCode statistics
- **Activity Calendar**: Heatmap visualization of coding activity
- **Problem Categorization**: Breakdown of problems by difficulty and category
- **Progress Tracking**: Visual representation of completion metrics
- **Data Persistence**: Caching strategies to reduce API calls

**Technical Challenge**: LeetCode doesn't offer an official API, requiring creative solutions to access and visualize data.

**Solution**: Developed a custom data aggregation system that collects LeetCode statistics and transforms them into visualizable formats, with caching to minimize unnecessary requests.

### Uses Page

The Uses page details my tools and equipment:

- **Categorized Content**: Organized presentation of tools by category
- **Visual Design**: Clean, scannable layout for easy consumption
- **Responsive Design**: Adapts to different screen sizes
- **Content Management**: Structured data for easy updates

## Technical Challenges & Solutions

### Cross-Platform Compatibility

**Challenge**: Ensuring consistent experiences across devices, browsers, and platforms.

**Solution**: Implemented progressive enhancement strategies, feature detection, and fallback experiences, with extensive testing across browser environments.

### Performance Optimization

**Challenge**: Maintaining fast load times despite rich media content and third-party integrations.

**Solution**: 
- Implemented code splitting and lazy loading
- Optimized asset delivery with responsive images
- Utilized caching strategies for API responses
- Minimized JavaScript bundle size with tree shaking

### Content Management

**Challenge**: Creating a scalable system for managing article content without a traditional CMS.

**Solution**: Built a file-based content system using MDX with frontmatter, enabling rich content with React components while maintaining developer-friendly workflows.

### API Integration Security

**Challenge**: Securely integrating with external APIs without exposing credentials.

**Solution**: Implemented server-side API requests with token management, separating authentication concerns from client-side rendering.

## Performance Optimizations

- **Image Optimization**: Next.js Image component with appropriate sizing and formats
- **Code Splitting**: Dynamic imports for route-based code splitting
- **Font Loading**: Optimized web font loading with font-display strategies
- **CSS Optimization**: Purged unused Tailwind classes in production
- **Caching Strategy**: API response caching with appropriate invalidation
- **Lazy Loading**: Components and media loaded only when needed
- **Bundle Analysis**: Regular bundle size monitoring and optimization

## Installation & Setup

To set up the project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/kianis4/suley-fitness-portfolio.git
   cd suley-fitness-portfolio
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env.local` file with the following variables:
   ```
   # Spotify API
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
   
   # Instagram API
   INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
   
   # Site URL for RSS
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

## Contributing

Contributions are welcome! Here's how you can contribute:

1. **Fork the Repository**:
   ```bash
   git fork https://github.com/kianis4/suley-fitness-portfolio.git
   ```

2. **Create a New Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit Changes**:
   ```bash
   git commit -m "Add your message here"
   ```

4. **Push to Your Branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Submit a Pull Request**: Open a pull request on the original repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.