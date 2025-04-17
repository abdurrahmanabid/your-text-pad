// components/AboutPage.tsx
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="avatar mb-4">
          <div className="w-24 rounded-full overflow-hidden ring ring-primary ring-offset-base-100 ring-offset-2 transform transition-transform duration-300 hover:scale-110 animate-fadeIn">
            <img src="/../src/assets/pp.png" alt="Abdur Rahman Abid" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">Abdur Rahman Abid</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Full Stack Developer
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">About Me</h2>
            <p className="mb-4">
              I'm a passionate developer with expertise in building modern web
              applications using React, TypeScript, and Node.js. With 5 years of
              experience in full-stack development, I specialize in creating
              efficient, scalable, and user-friendly applications.
            </p>
            <p>
              When I'm not coding, you can find me contributing to open-source
              projects, writing technical articles, or exploring new
              technologies in the ever-evolving world of web development.
            </p>
          </div>
        </div>

        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Technical Skills</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold">Frontend</h3>
                <p>React, TypeScript, TailwindCSS, Next.js, Redux</p>
              </div>
              <div>
                <h3 className="font-semibold">Backend</h3>
                <p>Node.js, Express, MongoDB, PostgreSQL, REST APIs</p>
              </div>
              <div>
                <h3 className="font-semibold">DevOps</h3>
                <p>Docker, AWS, CI/CD, GitHub Actions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow mb-12">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">About This Project</h2>
          <p className="mb-4">
            This text editor application was built to demonstrate modern web
            development techniques including:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>File System Access API integration</li>
            <li>JWT authentication flow</li>
            <li>Dual storage (local and database)</li>
            <li>Responsive UI with dark/light mode</li>
            <li>Tab-based document management</li>
          </ul>
          <p>
            The project showcases my ability to create full-featured
            applications with clean architecture and attention to user
            experience.
          </p>
        </div>
      </div>

      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Connect With Me</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/abdurrahmanabid"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <Github className="mr-2" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/ab-rahman33/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <Linkedin className="mr-2" />
              LinkedIn
            </a>
            <a
              href="mailto:abduurahmanabid33@gmail.com"
              className="btn btn-ghost"
            >
              <Mail className="mr-2" />
              Email
            </a>
            <a
              href="https://x.com/tweet_ab_rahman"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <Twitter className="mr-2" />X
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
