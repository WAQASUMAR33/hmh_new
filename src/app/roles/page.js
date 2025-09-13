'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from "../home/components/header";
import Footer from "../home/components/footer";

export default function RoleSelector() {
    const router = useRouter();

    const chooseRole = (role) => {
        router.push(`/signup?role=${role}`);
    };

    return (
        <>
            <Header />

            <div className="w-full max-w-[1250px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 my-10 px-4">
                {/* Publisher Card */}
                <div className="border rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-medium mb-4 text-center">
                        Am I a <span className="text-green-600 font-bold">Publisher</span>?
                    </h2>

                    <Link href="/signup?role=PUBLISHER">
                        <button
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-full mb-4 text-center"
                        >
                            Sign up to HVM
                        </button>
                    </Link>

                    <ul className="space-y-2 text-sm text-gray-700 mb-6">
                        <li>✅ You have an audience via website, social, or email.</li>
                        <li>✅ You promote products via affiliate links.</li>
                        <li>✅ You post content regularly on social or web.</li>
                        <li>✅ You improve the user shopping journey or boost conversions.</li>
                    </ul>

                    <p className="text-sm font-medium">Im already a publisher on HVM</p>
                    <a href="/login" className="text-blue-600 text-sm hover:underline">
                        Log in to the platform
                    </a>
                </div>

                {/* Advertiser Card */}
                <div className="border rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-medium mb-4 text-center">
                        Am I an <span className="text-purple-600 font-bold">Advertiser</span>?
                    </h2>

                    <Link href="/signup?role=ADVERTISER">
                        <button
                            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-full mb-4 text-center"
                        >
                            Get in touch
                        </button>
                    </Link>

                    <ul className="space-y-2 text-sm text-gray-700 mb-6">
                        <li>✅ You sell a product or service online.</li>
                        <li>✅ You want to grow sales through affiliate marketing.</li>
                        <li>✅ You work with influencers, creators, or tech partners.</li>
                        <li>✅ You want to expand your marketing with commission-based models.</li>
                    </ul>

                    <p className="text-sm font-medium">Im already an advertiser on the HVM platform</p>
                    <a href="/login" className="text-blue-600 text-sm hover:underline">
                        Log in to the platform
                    </a>
                </div>
            </div>
            <Footer />
        </>
    );
}