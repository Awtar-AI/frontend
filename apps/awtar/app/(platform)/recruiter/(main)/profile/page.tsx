"use client";

import {
    Edit2,
    MapPin,
    Briefcase,
    Mail,
    Phone,
    Globe,
    Linkedin,
    Twitter,
    Camera,
    CheckCircle2,
    Star,
    Clock,
    Building2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const INITIAL_PROFILE = {
    name: "Alex Rivera",
    avatar: "https://i.pravatar.cc/150?img=3",
    title: "Senior Recruiter",
    company: "TechNest Innovations Inc.",
    location: "New York, USA",
    email: "alex.rivera@technest.com",
    phone: "+1 (212) 555-0147",
    website: "linkedin.com/in/alexrivera",
    bio: "Experienced recruiter with 8+ years specializing in technology and product roles. Passionate about connecting top talent with innovative companies. Known for data-driven sourcing strategies and building exceptional candidate experiences.",
    specializations: ["Software Engineering", "Product Design", "Data Science", "DevOps", "Leadership Roles"],
    stats: [
        { label: "Positions Filled", value: "234" },
        { label: "Avg. Time to Hire", value: "18 days" },
        { label: "Candidate Satisfaction", value: "96%" },
        { label: "Active Jobs", value: "12" },
    ],
    recentPlacements: [
        { role: "Senior Software Engineer", company: "FinTech Corp", date: "Mar 2025" },
        { role: "Product Designer (L4)", company: "StartupXYZ", date: "Feb 2025" },
        { role: "Data Analyst Lead", company: "HealthTech Inc.", date: "Jan 2025" },
    ],
};

export default function RecruiterProfilePage() {
    const [profile, setProfile] = useState(INITIAL_PROFILE);
    const [editingBio, setEditingBio] = useState(false);
    const [bioDraft, setBioDraft] = useState(profile.bio);
    const [editingInfo, setEditingInfo] = useState(false);
    const [infoDraft, setInfoDraft] = useState({
        name: profile.name,
        title: profile.title,
        location: profile.location,
        email: profile.email,
        phone: profile.phone,
        website: profile.website,
    });
    const [newSkill, setNewSkill] = useState("");

    const removeSkill = (skill: string) => {
        setProfile({ ...profile, specializations: profile.specializations.filter(s => s !== skill) });
    };

    const addSkill = () => {
        if (newSkill.trim() && !profile.specializations.includes(newSkill.trim())) {
            setProfile({ ...profile, specializations: [...profile.specializations, newSkill.trim()] });
            setNewSkill("");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-5">
            {/* Profile Header */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Cover Banner */}
                <div className="h-28 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 relative">
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>

                <div className="px-6 pb-6">
                    {/* Avatar */}
                    <div className="flex items-end justify-between -mt-10 mb-4">
                        <div className="relative">
                            <Image
                                src={profile.avatar}
                                alt={profile.name}
                                width={80}
                                height={80}
                                className="rounded-xl object-cover border-4 border-white shadow-md"
                            />
                            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <Camera className="w-3 h-3 text-white" />
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                setInfoDraft({ name: profile.name, title: profile.title, location: profile.location, email: profile.email, phone: profile.phone, website: profile.website });
                                setEditingInfo(!editingInfo);
                            }}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                        </button>
                    </div>

                    {editingInfo ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
                                    <input type="text" value={infoDraft.name} onChange={e => setInfoDraft({ ...infoDraft, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Job Title</label>
                                    <input type="text" value={infoDraft.title} onChange={e => setInfoDraft({ ...infoDraft, title: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Location</label>
                                    <input type="text" value={infoDraft.location} onChange={e => setInfoDraft({ ...infoDraft, location: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
                                    <input type="email" value={infoDraft.email} onChange={e => setInfoDraft({ ...infoDraft, email: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Phone</label>
                                    <input type="text" value={infoDraft.phone} onChange={e => setInfoDraft({ ...infoDraft, phone: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">LinkedIn / Website</label>
                                    <input type="text" value={infoDraft.website} onChange={e => setInfoDraft({ ...infoDraft, website: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => setEditingInfo(false)} className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                                <button onClick={() => { setProfile({ ...profile, ...infoDraft }); setEditingInfo(false); }} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">Save Changes</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
                                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium mt-0.5">{profile.title}</p>
                                    <div className="flex items-center gap-4 mt-2 flex-wrap text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {profile.company}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact row */}
                            <div className="flex items-center gap-5 mt-4 text-xs font-semibold flex-wrap">
                                <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors">
                                    <Mail className="w-3.5 h-3.5" /> {profile.email}
                                </a>
                                <span className="flex items-center gap-1.5 text-gray-600">
                                    <Phone className="w-3.5 h-3.5" /> {profile.phone}
                                </span>
                                <a href="#" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                                    <Linkedin className="w-3.5 h-3.5" /> {profile.website}
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profile.stats.map(stat => (
                    <div key={stat.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center">
                        <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Bio */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold text-gray-900">About Me</h2>
                            <button onClick={() => { setBioDraft(profile.bio); setEditingBio(!editingBio); }} className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-colors">
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        {editingBio ? (
                            <div className="space-y-3">
                                <textarea value={bioDraft} onChange={e => setBioDraft(e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => setEditingBio(false)} className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                                    <button onClick={() => { setProfile({ ...profile, bio: bioDraft }); setEditingBio(false); }} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">Save</button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
                        )}
                    </div>

                    {/* Recent Placements */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" /> Recent Placements
                        </h2>
                        <div className="space-y-3">
                            {profile.recentPlacements.map((p, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                            <Building2 className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{p.role}</p>
                                            <p className="text-xs text-gray-500 font-medium">{p.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                                        <Clock className="w-3 h-3" /> {p.date}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                    {/* Specializations */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-blue-500" /> Specializations
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {profile.specializations.map(skill => (
                                <span key={skill} className="group flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                                    {skill}
                                    <button onClick={() => removeSkill(skill)} className="text-blue-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-sm leading-none">×</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Add specialization..."
                                value={newSkill}
                                onChange={e => setNewSkill(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") addSkill(); }}
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <button onClick={addSkill} className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Contact Details</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5 text-xs">
                                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline font-semibold break-all">{profile.email}</a>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs">
                                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-700 font-semibold">{profile.phone}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs">
                                <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <a href="#" className="text-blue-600 hover:underline font-semibold">{profile.website}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
