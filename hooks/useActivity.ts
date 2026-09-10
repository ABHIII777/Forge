"use client";

import { useCallback, useEffect, useState } from "react";
import {
    fetchActivity,
    type ActivityFilters,
    type ActivityWithUser,
} from "@/lib/api/activity";

export function useActivity(baseFilters: Omit<ActivityFilters, "cursor"> = {}) {
    const key = JSON.stringify(baseFilters);
    const [items, setItems] = useState<ActivityWithUser[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchActivity(JSON.parse(key) as ActivityFilters)
            .then((page) => {
                if (cancelled) return;
                setItems(page.activities);
                setNextCursor(page.nextCursor);
                setError(null);
                setLoading(false);
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : "Failed to load activity");
                setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [key]);

    const loadMore = useCallback(async () => {
        if (!nextCursor || loadingMore) return;
        setLoadingMore(true);
        try {
            const page = await fetchActivity({
                ...(JSON.parse(key) as ActivityFilters),
                cursor: nextCursor,
            });
            setItems((prev) => [...prev, ...page.activities]);
            setNextCursor(page.nextCursor);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load more activity");
        } finally {
            setLoadingMore(false);
        }
    }, [key, nextCursor, loadingMore]);

    return { items, nextCursor, loading, loadingMore, error, loadMore };
}
