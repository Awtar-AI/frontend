import { FilePlus2 } from "lucide-react";
import { RecruiterPageBanner } from "../_components/RecruiterPageBanner";
import { PostJobForm } from "./_components/PostJobForm";

export default function PostJobPage() {
    return (
        <div className="w-full space-y-6">
            <RecruiterPageBanner
                title="Post a Job"
                description="Create a clear, high-quality job post to attract the right candidates faster."
                Icon={FilePlus2}
            />

            <PostJobForm />
        </div>
    );
}
