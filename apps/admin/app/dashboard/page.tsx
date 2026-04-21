import Link from "next/link";
import { AdminShell } from "../_components/admin-shell";
import { StatCard } from "../_components/stat-card";
import { OrgAreaChart } from "../_components/charts/org-area-chart";
import { StatusPieChart } from "../_components/charts/status-pie-chart";
import { StatusBadge } from "../_components/status-badge";
import { getDashboardStats, getOrganizations } from "../../lib/api";
import { Building2, FileText, CheckCircle2, XOctagon } from "lucide-react";

export default async function DashboardPage() {
    const stats = await getDashboardStats();
    
    // Fetch just a few pending organizations for the recent table
    const paginatedOrgs = await getOrganizations(1, 4, "pending");
    const recentPendingOrgs = paginatedOrgs.organizations.slice(0, 4);

    return (
        <AdminShell title="Dashboard">
            
            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Total Organizations" 
                    value={stats.totalOrgs} 
                    icon={Building2} 
                    trend={{ value: 12, isPositive: true }}
                />
                <StatCard 
                    title="Pending Reviews" 
                    value={stats.pendingOrgs} 
                    icon={FileText} 
                />
                <StatCard 
                    title="Active Organizations" 
                    value={stats.activeOrgs} 
                    icon={CheckCircle2} 
                    trend={{ value: 5, isPositive: true }}
                />
                <StatCard 
                    title="Suspended Orgs" 
                    value={stats.suspendedOrgs} 
                    icon={XOctagon} 
                />
            </div>

            <div className="mb-8 grid gap-6 lg:grid-cols-3">
                <OrgAreaChart />
                <StatusPieChart 
                    active={stats.activeOrgs} 
                    pending={stats.pendingOrgs} 
                    suspended={stats.suspendedOrgs} 
                />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-5 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">Action Required: Pending Approvals</h3>
                    <Link href="/organizations" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        View All
                    </Link>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Organization Name</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Industry</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Size</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentPendingOrgs.map((org) => (
                                <tr key={org.id} className="transition-colors hover:bg-blue-50/30">
                                    <td className="px-6 py-4 font-bold text-gray-900">{org.organizationName}</td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{org.industry || "—"}</td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{org.organizationSize} employees</td>
                                    <td className="px-6 py-4"><StatusBadge status={org.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <Link 
                                            href={`/organizations/${org.id}`}
                                            className="inline-flex rounded-lg border border-gray-200 bg-white shadow-sm px-3 py-1.5 font-bold text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600"
                                        >
                                            Review
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {recentPendingOrgs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-medium">
                                        No pending organizations to review.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminShell>
    );
}
