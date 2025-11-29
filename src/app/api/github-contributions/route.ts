import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";

interface ContributionDay {
    contributionCount: number;
    date: string;
}

interface Week {
    contributionDays: ContributionDay[];
}

interface ContributionCalendar {
    totalContributions: number;
    weeks: Week[];
}

interface GitHubResponse {
    data: {
        user: {
            contributionsCollection: {
                contributionCalendar: ContributionCalendar;
            };
        };
    };
    errors?: Array<{ message: string }>;
}

const CACHE_DURATION = 60 * 60; // 1 hour in seconds

// Create Redis client
let redis: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
    if (!redis) {
        redis = createClient({ url: process.env.REDIS_URL });
        await redis.connect();
    }
    return redis;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userName = searchParams.get("userName");

    if (!userName) {
        return NextResponse.json({ error: "userName is required" }, { status: 400 });
    }

    // Check Redis cache first
    try {
        const client = await getRedisClient();
        const cached = await client.get(`github-contributions:${userName}`);

        if (cached) {
            const data = JSON.parse(cached);
            return NextResponse.json(data, {
                headers: {
                    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
                    "X-Cache-Status": "HIT-REDIS",
                },
            });
        }
    } catch (error) {
        // Silently continue to GitHub API if Redis fails
    }

    const query = `
    query($userName:String!) { 
      user(login: $userName){
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

    try {
        const response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
                variables: { userName },
            }),
        });

        const data: GitHubResponse = await response.json();

        if (!response.ok || data.errors) {
            return NextResponse.json(
                { error: data.errors?.[0]?.message || "Failed to fetch" },
                { status: response.status }
            );
        }

        // Store in Redis cache with TTL
        try {
            const client = await getRedisClient();
            await client.setEx(`github-contributions:${userName}`, CACHE_DURATION, JSON.stringify(data));
        } catch (error) {
            console.error("Failed to cache data in Redis:", error);
        }

        return NextResponse.json(data, {
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
                "X-Cache-Status": "MISS-REDIS",
            },
        });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
