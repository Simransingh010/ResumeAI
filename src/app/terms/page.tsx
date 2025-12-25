import { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
    title: `Terms of Service - ${APP_NAME}`,
    description: `Terms of Service for ${APP_NAME}. Read our terms and conditions.`,
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="mx-auto max-w-4xl px-6 py-16">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8">
                    Terms of Service
                </h1>

                <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Last updated: December 2024
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            By accessing and using {APP_NAME}, you accept and agree to be bound by these
                            Terms of Service. If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            2. Description of Service
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {APP_NAME} provides AI-powered resume analysis and building tools. Our service
                            analyzes resumes for ATS compatibility, provides feedback, and helps users
                            create optimized resumes.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            3. User Responsibilities
                        </h2>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                            <li>You are responsible for maintaining the confidentiality of your account</li>
                            <li>You agree to provide accurate information in your resume</li>
                            <li>You will not use the service for any illegal purposes</li>
                            <li>You will not attempt to reverse engineer or exploit the service</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            4. Intellectual Property
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            You retain ownership of your resume content. By using our service, you grant
                            us a limited license to process your content for the purpose of providing
                            our analysis services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            5. Disclaimer
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Our AI analysis is provided for informational purposes only. We do not guarantee
                            job placement or interview success. Results may vary based on individual
                            circumstances and job market conditions.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            6. Limitation of Liability
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {APP_NAME} shall not be liable for any indirect, incidental, special,
                            consequential, or punitive damages resulting from your use of the service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            7. Changes to Terms
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            We reserve the right to modify these terms at any time. We will notify users
                            of significant changes via email or through the service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            8. Contact
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            For questions about these Terms of Service, please contact us at
                            legal@atsense.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
