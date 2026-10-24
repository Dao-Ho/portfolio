"use client";

import NextError from "next/error";
import posthog from "posthog-js";
import { useEffect } from "react";

export default function GlobalError({ error }) {
    useEffect(() => {
        posthog.captureException(error);
    }, [error]);

    return (
        <html>
            <body>
                <NextError statusCode={0} />
            </body>
        </html>
    );
}
