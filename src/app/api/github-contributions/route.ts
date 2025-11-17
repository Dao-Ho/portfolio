import { NextRequest, NextResponse } from 'next/server';

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

// In-memory cache
const cache = new Map<string, { data: GitHubResponse; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userName = searchParams.get('userName');

  if (!userName) {
    return NextResponse.json(
      { error: 'userName is required' },
      { status: 400 }
    );
  }

  // Check cache first
  const cached = cache.get(userName);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    console.log(`✅ Cache hit for ${userName}`);
    return NextResponse.json(cached.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-Cache-Status': 'HIT'
      }
    });
  }

  console.log(`❌ Cache miss for ${userName}, fetching from GitHub...`);

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
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { userName }
      })
    });

    console.log('GitHub API response status:', response.status);

    const data: GitHubResponse = await response.json();
    
    if (!response.ok || data.errors) {
      return NextResponse.json(
        { error: data.errors?.[0]?.message || 'Failed to fetch' },
        { status: response.status }
      );
    }

    // Store in cache
    cache.set(userName, { data, timestamp: now });
    console.log(`💾 Cached data for ${userName}`);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-Cache-Status': 'MISS'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}