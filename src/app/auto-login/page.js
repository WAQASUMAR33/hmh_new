'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoLogin() {
    const router = useRouter();

    useEffect(() => {
        const autoLogin = async () => {
            try {
                const response = await fetch('/api/debug/test-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'test.advertiser@example.com',
                        password: 'password123'
                    }),
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Auto-login successful:', data);
                    
                    // Redirect to publishers page
                    router.push('/advertiser/publishers');
                } else {
                    console.error('Auto-login failed');
                    alert('Auto-login failed. Please try manual login.');
                }
            } catch (error) {
                console.error('Auto-login error:', error);
                alert('Auto-login error. Please try manual login.');
            }
        };

        autoLogin();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Logging you in automatically...</p>
                <p className="mt-2 text-sm text-gray-500">Redirecting to publishers page...</p>
            </div>
        </div>
    );
}
