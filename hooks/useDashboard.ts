"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchDashboard, type DashboardData } from "@/lib/api/dashboard";

export type { DashboardData };

export function useDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchDashboard()
            .then((body) => {
                if (cancelled) return;
                setData(body);
                setError(null);
                setLoading(false);
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : "Failed to load dashboard");
                setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const refetch = useCallback(async () => {
        setLoading(true);
        try {
            const body = await fetchDashboard();
            setData(body);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, refetch };
}
