
"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const pageview = (url: string) => {
    // Check if window and gtag are defined
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function' && GA_ID) {
        (window as any).gtag("config", GA_ID, {
            page_path: url,
        });
    }
};

export default function GoogleAnalytics() {
    const pathname = usePathname();

    useEffect(() => {
        // This useEffect will now handle the initial pageview as well as
        // subsequent pageviews on navigation.
        pageview(pathname);
    }, [pathname]);

    // Don't render anything if the GA ID is not set
    if (!GA_ID) {
        return null;
    }

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_ID}');
                    `,
                }}
            />
        </>
    );
}
