"use client";

import {
    ArrowUpDown,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    MoreVertical,
    Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

// Mock Data
const INITIAL_APPLICANTS = [
    {
        id: "1",
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/100?img=1",
        experience: "4 yrs – Mobile App UI/UX",
        location: "New York",
        submitted: "Mar 20, 2025",
        status: "New",
    },
    {
        id: "2",
        name: "Michael Smith",
        avatar: "https://i.pravatar.cc/100?img=11",
        experience: "3 yrs – SaaS Platforms",
        location: "California",
        submitted: "Apr 15, 2025",
        status: "Shortlisted",
    },
    {
        id: "3",
        name: "Emily Davis",
        avatar: "https://i.pravatar.cc/100?img=5",
        experience: "5 yrs – Fintech UI",
        location: "California",
        submitted: "May 10, 2025",
        status: "Interviewed",
    },
    {
        id: "4",
        name: "David Brown",
        avatar: "https://i.pravatar.cc/100?img=12",
        experience: "2 yrs – E-commerce UX",
        location: "Illinois",
        submitted: "Jun 5, 2025",
        status: "Rejected",
    },
    {
        id: "5",
        name: "Laura Wilson",
        avatar: "https://i.pravatar.cc/100?img=9",
        experience: "6 yrs – HealthTech Apps",
        location: "Florida",
        submitted: "Jul 18, 2025",
        status: "Shortlisted",
    },
    {
        id: "6",
        name: "James Taylor",
        avatar: "https://i.pravatar.cc/100?img=15",
        experience: "4 yrs – Mobile Banking",
        location: "Washington",
        submitted: "Aug 22, 2025",
        status: "New",
    },
    {
        id: "7",
        name: "Patricia Miller",
        avatar: "https://i.pravatar.cc/100?img=33",
        experience: "3 yrs – Startup UX",
        location: "Texas",
        submitted: "Sep 30, 2025",
        status: "New",
    },
    {
        id: "8",
        name: "Robert Garcia",
        avatar: "https://i.pravatar.cc/100?img=51",
        experience: "7 yrs – EdTech Platforms",
        location: "Massachusetts",
        submitted: "Oct 14, 2025",
        status: "Shortlisted",
    },
    {
        id: "9",
        name: "John Martinez",
        avatar: "https://i.pravatar.cc/100?img=60",
        experience: "5 yrs – Fintech Mobile Apps",
        location: "District of Columbia",
        submitted: "Nov 28, 2025",
        status: "Interviewed",
    },
    {
        id: "10",
        name: "William Hernandez",
        avatar: "https://i.pravatar.cc/100?img=68",
        experience: "2.5 yrs – Wellness Apps UX",
        location: "Arizona",
        submitted: "Dec 1, 2025",
        status: "Rejected",
    },
];

type Applicant = (typeof INITIAL_APPLICANTS)[number];

const ITEMS_PER_PAGE = 5;

type SortConfig = {
    key: string;
    direction: "asc" | "desc";
} | null;

export default function JobApplicantsList() {
    const [applicants, setApplicants] = useState<typeof INITIAL_APPLICANTS>(INITIAL_APPLICANTS);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const toggleRow = (id: string) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
        } else {
            setSelectedRows([...selectedRows, id]);
        }
    };

    const toggleAll = () => {
        if (selectedRows.length === currentApplicants.length && currentApplicants.length > 0) {
            setSelectedRows([]);
        } else {
            setSelectedRows(currentApplicants.map((a) => a.id));
        }
    };

    const deleteApplicant = (id: string) => {
        setApplicants(applicants.filter((a) => a.id !== id));
        setSelectedRows(selectedRows.filter((rowId) => rowId !== id));

        // Reset page if deleted last item on current page
        const newTotal = applicants.length - 1;
        if (currentPage > Math.ceil(newTotal / ITEMS_PER_PAGE)) {
            setCurrentPage(Math.max(1, Math.ceil(newTotal / ITEMS_PER_PAGE)));
        }
    };

    const getStatusStyles = (status: string, borderMode = false) => {
        switch (status) {
            case "New":
                return borderMode ? "text-blue-600 font-medium" : "bg-blue-50 text-blue-600";
            case "Shortlisted":
                return borderMode ? "text-green-600 font-medium" : "bg-green-50 text-green-600";
            case "Interviewed":
                return borderMode ? "text-purple-600 font-medium" : "bg-purple-50 text-purple-600";
            case "Rejected":
                return borderMode ? "text-red-500 font-medium" : "bg-red-50 text-red-500";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    // Derived states
    const statusCounts = applicants.reduce(
        (acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>,
    );

    const filteredApplicants = activeTab
        ? applicants.filter((app) => app.status === activeTab)
        : applicants;

    const handleSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedApplicants = useMemo(() => {
        const sortable = [...filteredApplicants];
        if (sortConfig !== null) {
            sortable.sort((a: Applicant, b: Applicant) => {
                const key = sortConfig.key as keyof Applicant;
                const va = a[key];
                const vb = b[key];
                if (va < vb) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (va > vb) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortable;
    }, [filteredApplicants, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(sortedApplicants.length / ITEMS_PER_PAGE);
    const indexOfLast = currentPage * ITEMS_PER_PAGE;
    const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
    const currentApplicants = sortedApplicants.slice(indexOfFirst, indexOfLast);

    const filters = ["Status", "Experience Level", "Location", "Date"];

    // Handler to switch tabs and reset page to 1
    const handleTabChange = (tab: string | null) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <div className="w-full">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                {/* Header Subtitles */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-xl font-bold text-blue-600 tracking-tight">
                                UI/UX Designer
                            </h1>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-green-700 bg-green-100 uppercase tracking-widest">
                                Active
                            </span>
                        </div>
                        <div className="text-xs font-semibold text-gray-500 flex items-center gap-2">
                            <span>Remote</span>
                            <span className="text-gray-300">•</span>
                            <span>Mar 20, 2025</span>
                            <span className="text-gray-300">•</span>
                            <span>{applicants.length} Applicants</span>
                        </div>
                    </div>
                    {selectedRows.length > 0 && (
                        <button
                            onClick={() => {
                                setApplicants(
                                    applicants.filter((a) => !selectedRows.includes(a.id)),
                                );
                                setSelectedRows([]);
                            }}
                            className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-100 flex items-center gap-1"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Selected (
                            {selectedRows.length})
                        </button>
                    )}
                </div>

                {/* Filters & Status Tabs */}
                <div className="p-6 pb-2">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm"
                                >
                                    {filter} <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                            ))}
                        </div>
                        <div className="text-xs font-semibold text-gray-500">
                            {filteredApplicants.length} Applicants
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs mt-6">
                        <button
                            onClick={() => handleTabChange(null)}
                            className={
                                !activeTab
                                    ? "font-bold text-gray-900 border-b-2 border-gray-900 pb-1"
                                    : "font-medium text-gray-500 hover:text-gray-700 pb-1"
                            }
                        >
                            All ({applicants.length})
                        </button>
                        <span className="text-gray-300 mb-1">•</span>
                        <button
                            onClick={() => handleTabChange("New")}
                            className={
                                getStatusStyles("New", true) +
                                (activeTab === "New"
                                    ? " border-b-2 border-blue-600 pb-1"
                                    : " hover:opacity-80 pb-1")
                            }
                        >
                            New ({statusCounts.New || 0})
                        </button>
                        <span className="text-gray-300 mb-1">•</span>
                        <button
                            onClick={() => handleTabChange("Shortlisted")}
                            className={
                                getStatusStyles("Shortlisted", true) +
                                (activeTab === "Shortlisted"
                                    ? " border-b-2 border-green-600 pb-1"
                                    : " hover:opacity-80 pb-1")
                            }
                        >
                            Shortlisted ({statusCounts.Shortlisted || 0})
                        </button>
                        <span className="text-gray-300 mb-1">•</span>
                        <button
                            onClick={() => handleTabChange("Interviewed")}
                            className={
                                getStatusStyles("Interviewed", true) +
                                (activeTab === "Interviewed"
                                    ? " border-b-2 border-purple-600 pb-1"
                                    : " hover:opacity-80 pb-1")
                            }
                        >
                            Interviewed ({statusCounts.Interviewed || 0})
                        </button>
                        <span className="text-gray-300 mb-1">•</span>
                        <button
                            onClick={() => handleTabChange("Rejected")}
                            className={
                                getStatusStyles("Rejected", true) +
                                (activeTab === "Rejected"
                                    ? " border-b-2 border-red-500 pb-1"
                                    : " hover:opacity-80 pb-1")
                            }
                        >
                            Rejected ({statusCounts.Rejected || 0})
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto mt-2 flex-1 min-h-[400px]">
                    <table className="w-full text-left">
                        <thead className="bg-[#fbfcff] border-y border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-bold text-xs text-gray-400 w-12 align-middle">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedRows.length === currentApplicants.length &&
                                            currentApplicants.length > 0
                                        }
                                        onChange={toggleAll}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                </th>
                                <th
                                    className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                                    onClick={() => handleSort("name")}
                                >
                                    <div className="flex items-center gap-1">
                                        CANDIDATE{" "}
                                        <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase text-center cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                                    onClick={() => handleSort("experience")}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        EXPERIENCE{" "}
                                        <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase text-center cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                                    onClick={() => handleSort("location")}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        LOCATION{" "}
                                        <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase text-center cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                                    onClick={() => handleSort("submitted")}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        SUBMITTED{" "}
                                        <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase text-center cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                                    onClick={() => handleSort("status")}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        STATUS{" "}
                                        <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {currentApplicants.length > 0 ? (
                                currentApplicants.map((app) => (
                                    <tr
                                        key={app.id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(app.id)}
                                                onChange={() => toggleRow(app.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link
                                                href={`/recruiter/candidates/${app.id}`}
                                                className="flex items-center gap-3 w-fit group"
                                            >
                                                <Image
                                                    src={app.avatar}
                                                    alt={app.name}
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full object-cover group-hover:ring-2 ring-blue-100 transition-all"
                                                />
                                                <span className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                                                    {app.name}
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-xs font-semibold text-gray-600">
                                            {app.experience}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-xs font-semibold text-gray-600">
                                            {app.location}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-xs font-semibold text-gray-600">
                                            {app.submitted}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span
                                                className={`inline-flex px-3 py-1 rounded-md text-[11px] font-bold tracking-wide 
                          ${getStatusStyles(app.status, false)}`}
                                            >
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3 text-gray-400">
                                                <Link
                                                    href={`/recruiter/candidates/${app.id}`}
                                                    className="hover:text-blue-600 transition-colors"
                                                    title="View Profile"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => deleteApplicant(app.id)}
                                                    className="hover:text-red-500 transition-colors text-red-400"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button className="hover:text-gray-900 transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        No applicants match this category.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
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

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                (pageNumber) => (
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
                                ),
                            )}

                            <button
                                onClick={() =>
                                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                                }
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
