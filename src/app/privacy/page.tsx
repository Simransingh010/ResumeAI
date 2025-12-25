import { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
    title: `Privacy Policy - ${APP_NAME}`,
    description: `Privacy Policy for ${APP_NAME}. Learn how we collect, use, and protect your data.`,
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="mx-auto max-w-4xl px-6 py-16">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8">
                    Privacy Policy
                </h1>

                <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Last updated: December 2024
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            1. Information We Collect
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            We collect information you provide directly to us, including:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Account information (email address) when you sign up</li>
                            <li>Resume content when you upload files for analysis</li>
                            <li>Job descriptions you provide for matching</li>
                            <li>Resume data you enter in our builder tool</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            2. How We Use Your Information
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Analyze your resume and provide feedback</li>
                            <li>Generate ATS-optimized resume suggestions</li>
                            <li>Send you technical notices and support messages</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            3. Data Security
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            We implement appropriate security measures to protect your personal information.
                            Your resume data is encrypted in transit and at rest. We do not sell your personal
                            information to third parties.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            4. Data Retention
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            We retain your resume analysis data to provide you with historical insights.
                            You can request deletion of your data at any time by contacting us.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            5. Third-Party Services
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            We use third-party services including Google AI for resume analysis and
                            Supabase for authentication and data storage. These services have their
                            own privacy policies.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            6. Contact Us
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            If you have any questions about this Privacy Policy, please contact us at
                            privacy@atsense.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
