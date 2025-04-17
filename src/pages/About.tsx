// components/AboutPage.tsx
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="mockup-browser border bg-base-200 w-full max-w-6xl shadow-xl">
        <div className="mockup-browser-toolbar">
          <div className="input border border-base-300">
            https://yourtextpad.vercel.app/about
          </div>
        </div>
        <div className="p-6 bg-base-100">
          <div className="text-center mb-8">
            <div className="avatar mb-4">
              <div className="w-24 rounded-full overflow-hidden ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-110 transition-transform duration-300">
                <img src="/src/assets/pp.png" alt="Abdur Rahman Abid" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Abdur Rahman Abid</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Full Stack Developer
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="mockup-window border bg-base-200">
              <div className="p-4">
                <h2 className="text-2xl font-semibold mb-4">About Me</h2>
                <p className="mb-3">
                  I'm a passionate developer with expertise in building modern web
                  applications using React, TypeScript, and Node.js. With 5 years of
                  experience in full-stack development, I specialize in creating
                  efficient, scalable, and user-friendly applications.
                </p>
                <p>
                  Outside of coding, I contribute to open source, write articles, and
                  explore emerging web technologies.
                </p>
              </div>
            </div>

            <div className="mockup-window border bg-base-200">
              <div className="p-4">
                <h2 className="text-2xl font-semibold mb-4">Technical Skills</h2>
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

          <div className="mockup-code mb-12">
            <pre data-prefix="$">
              <code>This app showcases File System Access API, JWT auth, and more</code>
            </pre>
            <pre data-prefix=">">
              <code>Built with modern web development practices 🚀</code>
            </pre>
          </div>

          <div className="mockup-window border bg-base-200">
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-4">Connect With Me</h2>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/abdurrahmanabid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <Github className="mr-2" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/ab-rahman33/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <Linkedin className="mr-2" />
                  LinkedIn
                </a>
                <a
                  href="mailto:abduurahmanabid33@gmail.com"
                  className="btn btn-outline"
                >
                  <Mail className="mr-2" />
                  Email
                </a>
                <a
                  href="https://x.com/tweet_ab_rahman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <Twitter className="mr-2" />
                  X
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
