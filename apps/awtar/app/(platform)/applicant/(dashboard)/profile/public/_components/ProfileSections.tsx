import { Building2, Cloud, Code, GraduationCap, User } from "lucide-react";

export function ProfessionalSummary() {
    return (
        <div className="bg-white rounded-[24px] p-8 lg:p-10 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
            <h3 className="flex items-center gap-2 text-[18px] font-black text-gray-900 tracking-tight mb-5">
                <User className="w-5 h-5 text-blue-600" /> Professional Summary
            </h3>
            <p className="text-gray-600 font-medium leading-relaxed text-sm">
                Passionate Full Stack Engineer with 8+ years of experience building scalable web
                applications and distributed systems. Expert in React, Node.js, and cloud
                infrastructure. Proven track record of leading engineering teams and delivering
                high-impact features in fast-paced startup environments. Focused on clean code,
                performance optimization, and creating seamless user experiences.
            </p>
        </div>
    );
}

export function WorkExperience() {
    const experiences = [
        {
            title: "Senior Software Engineer",
            company: "TechFlow Solutions",
            date: "2020 - Present",
            icon: Building2,
            bullets: [
                "Architected and migrated legacy monolith to microservices using Node.js and AWS Lambda, reducing latency by 45%.",
                "Led a team of 6 engineers in developing a real-time collaborative dashboard using WebSockets and React.",
                "Implemented CI/CD pipelines that reduced deployment time from 2 hours to 15 minutes.",
            ],
        },
        {
            title: "Full Stack Developer",
            company: "CloudScale Inc.",
            date: "2017 - 2020",
            icon: Cloud,
            bullets: [
                "Developed responsive web interfaces using Vue.js and integrated with Python/Django backend.",
                "Optimized database queries in PostgreSQL, leading to a 30% improvement in page load speeds.",
                "Mentored junior developers and conducted weekly code reviews to maintain high quality standards.",
            ],
        },
    ];

    return (
        <div className="bg-white rounded-[24px] p-8 lg:p-10 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
            <h3 className="flex items-center gap-2 text-[18px] font-black text-gray-900 tracking-tight mb-8">
                <Building2 className="w-5 h-5 text-blue-600" /> Work Experience
            </h3>
            <div className="space-y-10">
                {experiences.map((exp) => {
                    const Icon = exp.icon;
                    return (
                        <div key={exp.company} className="flex flex-col sm:flex-row gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                <Icon className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                                    <div className="mb-2 sm:mb-0">
                                        <h4 className="text-lg font-black text-gray-900 tracking-tight">
                                            {exp.title}
                                        </h4>
                                        <p className="text-sm font-bold text-blue-600">
                                            {exp.company}
                                        </p>
                                    </div>
                                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                        {exp.date}
                                    </span>
                                </div>
                                <ul className="mt-4 space-y-2.5">
                                    {exp.bullets.map((bullet) => (
                                        <li
                                            key={bullet}
                                            className="text-sm text-gray-600 font-medium leading-relaxed flex gap-2"
                                        >
                                            <span className="text-gray-300 mt-1 shrink-0 select-none">
                                                •
                                            </span>{" "}
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function TechnicalSkills() {
    const categories = [
        {
            title: "LANGUAGES & CORE",
            skills: ["JavaScript (ES6+)", "TypeScript", "Python", "Go", "SQL"],
        },
        {
            title: "FRAMEWORKS & LIBRARIES",
            skills: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS"],
        },
        {
            title: "TOOLS & DEVOPS",
            skills: ["Docker", "Kubernetes", "AWS", "Git", "GitHub Actions"],
        },
        { title: "DESIGN & OTHERS", skills: ["Figma", "UI/UX Principles", "Agile/Scrum"] },
    ];

    return (
        <div className="bg-white rounded-[24px] p-8 lg:p-10 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
            <h3 className="flex items-center gap-2 text-[18px] font-black text-gray-900 tracking-tight mb-8">
                <Code className="w-5 h-5 text-blue-600" /> Technical Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categories.map((cat) => (
                    <div key={cat.title}>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                            {cat.title}
                        </h4>
                        <div className="flex flex-wrap gap-2.5">
                            {cat.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-[10px] cursor-default shadow-sm hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function EducationList() {
    return (
        <div className="bg-white rounded-[24px] p-8 lg:p-10 border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]">
            <h3 className="flex items-center gap-2 text-[18px] font-black text-gray-900 tracking-tight mb-6">
                <GraduationCap className="w-5 h-5 text-blue-600" /> Education
            </h3>
            <div className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1 pt-1">
                    <h4 className="text-lg font-black text-gray-900 tracking-tight">
                        B.S. in Computer Science
                    </h4>
                    <p className="text-sm font-bold text-blue-600 mt-0.5">Stanford University</p>
                    <p className="text-[11px] font-bold text-gray-400 mt-2 uppercase tracking-wide">
                        Class of 2018 • Magna Cum Laude
                    </p>
                </div>
            </div>
        </div>
    );
}
