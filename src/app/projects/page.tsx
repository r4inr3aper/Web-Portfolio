"use client";
import { PageTransition } from "@/components/animation/page-transition";
import { useState } from "react";
import { ExternalLink, Github, Code } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      id: 1,
      name: "Incandescence 2025 Official Website",
      description:
        "Developed a scalable game feature with photo uploads, letter collection and robust backend handling over 1.3M+ API requests.",
      image:
        "/incand.png",
      imageAlt: "Screenshot of portfolio website homepage with dark theme",
      techStack: [
        "Next.js",
        "TailwindCSS",
        "Typescript",
        "Express.js",
        "MongoDB",
        "Prisma",
        "Node.js",
        "Amazon S3",
        "Git",
      ],
      link: "https://incand.in",
      github: "https://github.com/gdsc-nits-org/incand-api-2025",
      featured: true,
      category: ["fullstack", "frontend-design"],
    },
    {
      id: 2,
      name: "Flick",
      description:
        "Fully functional e-commerce platform with user authentication, order management, promo code management and admin dashboard.",
      image:
        "/flick.png",
      imageAlt: "E-commerce platform product listing page",
      techStack: [
        "React.js",
        "SCSS",
        "Express.js",
        "MongoDB",
        "Git",
        "Node.js",
      ],
      link: "https://flick-puce.vercel.app/",
      github: "https://github.com/r4inr3aper/Flick",
      featured: true,
      category: ["fullstack"],
    },
    {
      "id": 3,
      "name": "Inframe School Official Website",
      "description": "Built a custom CMS from scratch for efficient content management, ensuring easy updates for admins.",
      "image": "/inframe-school.png",
      "imageAlt": "Inframe School homepage interface with custom CMS",
      "techStack": [
        "Next.js",
        "TailwindCSS",
        "Typescript",
        "Node.js",
        "Express.js",
        "MongoDB",
        "JWT",
        "Vercel",
        "Git"
      ],
      "link": "https://www.inframeschool.com/",
      "github": "", 
      "featured": false,
      "category": ["fullstack"]
    },
    {
      id: 4,
      name: "Tecnoesis 2024 Official Website",
      description:
        "Tech fest site built for high traffic. Developed complex GSAP animations, integrated multiple APIs and handled 1M+ backend requests for a seamless user experience.",
      image:
        "/tecnoesis.png",
      imageAlt: "AI chat application interface showing conversation",
      techStack: [
        "Next.js",
        "TailwindCSS",
        "Typescript",
        "GSAP",
        "Express.js",
        "MongoDB",
        "Prisma",
        "Node.js",
        "Git",
      ],
      link: "https://tecnoesis-2024.pages.dev/",
      github: "https://github.com/gdsc-nits-org/tecnoesis-2024",
      featured: false,
      category: ["fullstack", "frontend-design"],
    },
    {
      id: 5,
      name: "Interview.ly",
      description:
        "An AI-powered mock-interview tool offering realistic practice, probing follow-ups and clear feedback to help you prepare smarter and land offers faster.",
      image: "/interview.png",
      imageAlt: "Interview.ly Homepage",
      techStack: [
        "Next.js",
        "TailwindCSS",
        "Typescript",
        "Firebase",
        "Gemini API",
        "VAPI Agent",
        "Node.js",
        "Git",
      ],
      link: "https://interview-ly.vercel.app/",
      github: "https://github.com/r4inr3aper/Interview.ly",
      featured: false,
      category: ["ai-ml"],
    },
    {
      id: 6,
      name: "Mood of NITS",
      description:
        "A platform for campus exit polls and election content sharing. Enables all users to participate in polls and contribute election-related posts.",
      image: "/mood.png",
      imageAlt: "Mood of NITS Homepage",
      techStack: [
        "Next.js",
        "TailwindCSS",
        "Typescript",
        "Express.js",
        "MongoDB",
        "Prisma",
        "Node.js",
        "JWT",
        "Git",
      ],
      link: "https://www.moodofnits.site/",
      featured: false,
      category: ["fullstack"],
    },
    {
      id: 7,
      name: "Tecventures Landing Page",
      description:
        "Modern landing page for an agency to display their services, with a blog page for posting updates and articles.",
      image: "/tecventures.png",
      imageAlt: "Tecventures agency landing page screenshot",
      techStack: [
        "Next.js",
        "TailwindCSS",
        "Typescript",
        "GSAP",
        "FormSpree",
        "Node.js",
        "Git",
      ],
      link: "https://tecventures-frontend.vercel.app/",
      featured: false,
      category: ["frontend-design"],
    },
    {
      id: 8,
      name: "MERN Stack Chat App",
      description:
        "Real-time chat application featuring single & group chats with admin-controlled chat rooms and user management.",
      image:
        "https://assets-global.website-files.com/640f99c52b298c7753381c38/64227fdf55b3ddef95c18e5c_63eea96ea535cc41b88083ef_KkLQmdi5g7hcjsceNvVeC0XZ4B78p1wJWwRf2kHmgQE8vcYNhQeswTYpe06Pq_r3vRFMi6RDoslKP3r2XQXUtr6wq-O_W4ROZQF0mCtKlJ183XcHxcVKBfOHU9I8k9BFgrGnSgU5jJE2QrvZVus6BUI.png",
      imageAlt: "Chat app interface showing group and private chat windows",
      techStack: [
        "React.js",
        "Redux",
        "Express.js",
        "Socket.io",
        "MongoDB",
        "JWT",
      ],
      github: "https://github.com/r4inr3aper/MERN-Chat-App",
      featured: false,
      category: ["fullstack"],
    },
    {
      id: 9,
      name: "E-Cell NIT Silchar Official Website",
      description:
        "Developed a responsive and interactive website for the Entrepreneurship Cell of NIT Silchar, featuring event management and member profiles.",
      image:
        "/ecell.png",
      imageAlt: "E-Cell NIT Silchar official website homepage",
      techStack: [
        "React.js",
        "Redux",
        "Express.js",
        "MongoDB",
        "JWT",
        "Git",
        "Node.js",
      ],
      link: "https://ecellnits.org/",
      github: "https://github.com/r4inr3aper/e-cell-website-22",
      featured: false,
      category: ["fullstack"],
    },
    {
      "id": 10,
      "name": "Ulog – A Promise for Affinity",
      "description": "Built a responsive, content-driven platform celebrating authentic Assamese heritage, featuring dynamic blog posts and rich media galleries.",
      "image": "/ulog.png",
      "imageAlt": "Homepage of Ulog – A Promise for Affinity",
      "techStack": [
        "Next.js",
        "Tailwind CSS",
        "Node.js",
        "Vercel",
        "Git"
      ],
      "link": "https://ulog-five.vercel.app/",
      "github": "https://github.com/r4inr3aper/ulog-heritage-collective",
      "featured": false,
      "category": ["frontend-design"]
    }
  ];

  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "fullstack", label: "Fullstack" },
    { id: "frontend-design", label: "Frontend & Design" },
    { id: "ai-ml", label: "AI/ML" },
  ];

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) => project.category.includes(activeCategory));

  return (
    <PageTransition>
      <section className="w-full flex flex-col justify-start px-1 mb-6">
        <h2 className="text-xl sm:text-2xl font-medium">Projects ~</h2>
        
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? "bg-stone-700 text-zinc-100 border border-stone-600 shadow-sm"
                  : "bg-stone-800/50 text-zinc-400 hover:text-zinc-200 hover:bg-stone-800/70 border border-stone-800"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={`border border-stone-800/90 rounded-lg overflow-hidden flex flex-col bg-stone-900/30 transition-all duration-300 hover:shadow-lg hover:shadow-stone-900/50 ${
              project.featured ? "ring-1 ring-stone-600/50" : ""
            }`}
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            <div className="relative w-full h-40 cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 z-10 m-2">
                {project.featured && (
                  <span className="px-2 py-0.5 bg-stone-800/80 text-xs rounded-md text-amber-400 border border-amber-500/30">
                    Featured
                  </span>
                )}
              </div>
              <img
                src={project.image}
                alt={project.imageAlt}
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
                style={{
                  transform:
                    hoveredProject === project.id ? "scale(1.05)" : "scale(1)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent opacity-70"></div>
            </div>

            <div className="p-4 flex flex-col gap-2 flex-grow">
              <h3 className="text-lg font-semibold text-zinc-100">
                {project.name}
              </h3>
              <p className="text-xs text-zinc-300 line-clamp-2">
                {project.description}
              </p>

              <div className="mt-2">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.techStack.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-0.5 bg-stone-800/70 text-xs rounded-md text-zinc-300 border border-stone-700/50"
                    >
                      <Code size={10} className="text-zinc-400" />
                      {tech}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-auto pt-2 border-t border-stone-800/50">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-700/80 text-xs font-medium text-zinc-100 relative no-underline duration-300 ease-in hover:bg-stone-600/60 border border-stone-600/30 mt-2"
                  >
                    <ExternalLink size={12} />
                    View Live
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-transparent text-xs font-medium text-zinc-300 relative no-underline duration-300 ease-in hover:bg-stone-800/80 border border-stone-700/30 mt-2"
                  >
                    <Github size={12} />
                    Code
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>
    </PageTransition>
  );
}
