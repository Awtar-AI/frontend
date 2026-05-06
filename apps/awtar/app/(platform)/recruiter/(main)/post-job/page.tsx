import { PostJobForm } from "./_components/PostJobForm";

export default function PostJobPage() {
    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Post a Job</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Create a new job posting for your organization.
                </p>
            </div>

            <PostJobForm />
        </div>
    );
}
