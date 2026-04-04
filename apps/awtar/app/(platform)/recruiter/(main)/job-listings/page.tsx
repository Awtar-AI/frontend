"use client";

import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Edit2,
    ExternalLink,
    MoreVertical,
    Trash2,
    ArrowUpDown,
    X,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

// Mock Data
const INITIAL_JOBS = [
    {
        id: 1,
        title: "UI/UX Designer",
        location: "Remote",
        applicants: 10,
        status: "Active",
        postedOn: "Mar 20, 2025",
    },
    {
        id: 2,
        title: "React Developer",
        location: "New York",
        applicants: 5,
        status: "Paused",
        postedOn: "Mar 5, 2025",
    },
    {
        id: 3,
        title: "Data Analyst",
        location: "San Francisco",
        applicants: 0,
        status: "Draft",
        postedOn: "Not yet published",
    },
    {
        id: 4,
        title: "Sales Executive",
        location: "Chicago",
        applicants: 8,
        status: "Active",
        postedOn: "Apr 30, 2025",
    },
    {
        id: 5,
        title: "Content Writer",
        location: "Hybrid",
        applicants: 3,
        status: "Closed",
        postedOn: "Feb 15, 2025",
    },
    {
        id: 6,
        title: "Graphic Designer",
        location: "Los Angeles",
        applicants: 6,
        status: "Active",
        postedOn: "Apr 28, 2025",
    },
    {
        id: 7,
        title: "Product Manager",
        location: "Austin",
        applicants: 7,
        status: "Paused",
        postedOn: "Mar 10, 2025",
    },
    {
        id: 8,
        title: "Senior QA Engineer",
        location: "Remote",
        applicants: 12,
        status: "Active",
        postedOn: "Apr 25, 2025",
    },
    {
        id: 9,
        title: "DevOps Engineer",
        location: "Seattle",
        applicants: 0,
        status: "Draft",
        postedOn: "Not yet published",
    },
    {
        id: 10,
        title: "HR Coordinator",
        location: "Atlanta",
        applicants: 0,
        status: "Closed",
        postedOn: "Mar 8, 2025",
    },
];

const ITEMS_PER_PAGE = 5;

type SortConfig = {
    key: string;
    direction: "asc" | "desc";
} | null;

type Job = typeof INITIAL_JOBS[0];

export default function JobListingsPage() {
    const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Modal state
    const [editingJob, setEditingJob] = useState<Job | null>(null);

    // Toggle row selection
    const toggleRow = (id: number) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
        } else {
            setSelectedRows([...selectedRows, id]);
        }
    };

    // Toggle bulk select
    const toggleAll = () => {
        if (selectedRows.length === currentJobs.length && currentJobs.length > 0) {
            setSelectedRows([]);
        } else {
            setSelectedRows(currentJobs.map(j => j.id));
        }
    };

    // Delete single job
    const deleteJob = (id: number) => {
        setJobs(jobs.filter(j => j.id !== id));
        setSelectedRows(selectedRows.filter(rowId => rowId !== id));
        
        // Reset page if we deleted the last item on the current page
        const newTotal = jobs.length - 1;
        if (currentPage > Math.ceil(newTotal / ITEMS_PER_PAGE)) {
            setCurrentPage(Math.max(1, Math.ceil(newTotal / ITEMS_PER_PAGE)));
        }
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingJob) return;
        setJobs(jobs.map(j => j.id === editingJob.id ? editingJob : j));
        setEditingJob(null);
    };

    // Sorting functionality
    const handleSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Filter Buttons to toggle sorts
    const handleFilterButtonClick = (label: string) => {
        let key = "";
        if (label === "Location") key = "location";
        if (label === "Status") key = "status";
        if (label === "Date") key = "postedOn";
        if (label === "Applicants") key = "applicants";
        if (key) handleSort(key);
    };

    const sortedJobs = useMemo(() => {
        const sortableJobs = [...jobs];
        if (sortConfig !== null) {
            sortableJobs.sort((a: any, b: any) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableJobs;
    }, [jobs, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
    const indexOfLast = currentPage * ITEMS_PER_PAGE;
    const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
    const currentJobs = sortedJobs.slice(indexOfFirst, indexOfLast);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Active":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-md whitespace-nowrap">
                        Active
                    </span>
                );
            case "Paused":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-md whitespace-nowrap">
                        Paused
                    </span>
                );
            case "Draft":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-md whitespace-nowrap">
                        Draft
                    </span>
                );
            case "Closed":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-md whitespace-nowrap">
                        Closed
                    </span>
                );
            default:
                return null;
        }
    };

    const filters = ["Location", "Status", "Date", "Applicants"];

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm relative">
            
            {/* EDIT MODAL */}
            {editingJob && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">Edit Job Listing</h2>
                            <button onClick={() => setEditingJob(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-widest">Job Title</label>
                                <input 
                                    type="text" 
                                    value={editingJob.title}
                                    onChange={(e) => setEditingJob({...editingJob, title: e.target.value})}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-widest">Location</label>
                                    <input 
                                        type="text" 
                                        value={editingJob.location}
                                        onChange={(e) => setEditingJob({...editingJob, location: e.target.value})}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-widest">Status</label>
                                    <select 
                                        value={editingJob.status}
                                        onChange={(e) => setEditingJob({...editingJob, status: e.target.value})}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Paused">Paused</option>
                                        <option value="Draft">Draft</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setEditingJob(null)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-bold text-sm rounded-lg hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header / Title */}
            <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-blue-600 tracking-tight">
                        Job Summary Table
                    </h1>
                </div>

                {selectedRows.length > 0 && (
                    <button 
                        onClick={() => {
                            setJobs(jobs.filter(j => !selectedRows.includes(j.id)));
                            setSelectedRows([]);
                        }}
                        className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-100 flex items-center gap-1"
                    >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedRows.length})
                    </button>
                )}
            </div>

            {/* Filters Row */}
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => handleFilterButtonClick(filter)}
                            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm"
                        >
                            {filter} <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                    ))}
                </div>
                <div className="text-sm font-semibold text-gray-500">{jobs.length} Jobs</div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-400 uppercase bg-[#fbfcff] border-y border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold w-12 align-middle">
                                <input
                                    type="checkbox"
                                    checked={selectedRows.length === currentJobs.length && currentJobs.length > 0}
                                    onChange={toggleAll}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </th>
                            <th 
                                className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                                onClick={() => handleSort('title')}
                            >
                                <div className="flex items-center gap-1 uppercase">
                                    Job Title <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                </div>
                            </th>
                            <th 
                                className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                                onClick={() => handleSort('location')}
                            >
                                <div className="flex items-center gap-1 uppercase">
                                    Location <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                </div>
                            </th>
                            <th 
                                className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none group text-center"
                                onClick={() => handleSort('applicants')}
                            >
                                <div className="flex items-center justify-center gap-1 uppercase">
                                    Applicants <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                </div>
                            </th>
                            <th 
                                className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none group text-center"
                                onClick={() => handleSort('status')}
                            >
                                <div className="flex items-center justify-center gap-1 uppercase">
                                    Status <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                </div>
                            </th>
                            <th 
                                className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                                onClick={() => handleSort('postedOn')}
                            >
                                <div className="flex items-center gap-1 uppercase">
                                    Posted On <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                </div>
                            </th>
                            <th className="px-6 py-4 font-semibold text-right uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentJobs.length > 0 ? (
                            currentJobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(job.id)}
                                            onChange={() => toggleRow(job.id)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <Link href="/recruiter/job-listings/1/applicants" className="hover:text-blue-600 transition-colors">
                                            {job.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-xs font-medium">
                                        {job.location}
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-600 text-xs font-medium">
                                        {job.applicants}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {getStatusBadge(job.status)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-xs font-medium">
                                        {job.postedOn}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3 text-blue-500">
                                            <button onClick={() => setEditingJob(job)} className="hover:text-blue-700 transition-colors" title="Edit">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => deleteJob(job.id)} className="hover:text-red-600 transition-colors text-red-500" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <Link href="/recruiter/job-listings/1/applicants" className="text-gray-400 hover:text-gray-600 transition-colors" title="View Applicants">
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                            <button className="text-gray-400 hover:text-gray-600 transition-colors ml-1" title="More Properties">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination block */}
            {totalPages > 0 && (
                <div className="flex flex-col items-center justify-center p-6 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                                    pageNumber === currentPage
                                        ? "text-white bg-blue-600 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        <button 
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
