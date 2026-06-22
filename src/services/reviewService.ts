import type { NewReview, Review, ReviewStorageMode } from '../types/review'

const LOCAL_KEY = 'portfolio-reviews'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const seedReviews: Review[] = [
  {
    id: 'seed-1',
    username: 'Alex',
    message:
      'Love the Windows XP vibe! The draggable windows and music player are a nice touch.',
    rating: 5,
    createdAt: '2026-06-10T10:00:00.000Z',
  },
  {
    id: 'seed-2',
    username: null,
    message: 'Super creative portfolio idea. Felt nostalgic using it!',
    rating: 5,
    createdAt: '2026-06-12T14:30:00.000Z',
  },
]

function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}

export function getReviewStorageMode(): ReviewStorageMode {
  return isSupabaseConfigured() ? 'supabase' : 'local'
}

function supabaseHeaders() {
  return {
    apikey: SUPABASE_ANON_KEY!,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  }
}

function mapRow(row: Record<string, unknown>): Review {
  return {
    id: String(row.id),
    username: row.username ? String(row.username) : null,
    message: String(row.message),
    rating: Number(row.rating) || 5,
    createdAt: String(row.created_at ?? row.createdAt),
  }
}

function loadLocalReviews(): Review[] {
  try {
    const saved = localStorage.getItem(LOCAL_KEY)
    if (!saved) return [...seedReviews]
    const parsed = JSON.parse(saved) as Review[]
    if (!Array.isArray(parsed)) return [...seedReviews]
    const seeds = seedReviews.filter(
      (seed) => !parsed.some((review) => review.id === seed.id),
    )
    return [...parsed, ...seeds].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  } catch {
    return [...seedReviews]
  }
}

function saveLocalReviews(reviews: Review[]) {
  const userReviews = reviews.filter((review) => !review.id.startsWith('seed-'))
  localStorage.setItem(LOCAL_KEY, JSON.stringify(userReviews))
}

export async function fetchReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured()) {
    return loadLocalReviews()
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/reviews?select=*&order=created_at.desc`,
    { headers: supabaseHeaders() },
  )

  if (!response.ok) {
    throw new Error('Could not load reviews. Please try again later.')
  }

  const rows = (await response.json()) as Record<string, unknown>[]
  return rows.map(mapRow)
}

export async function submitReview(input: NewReview): Promise<Review> {
  const trimmedMessage = input.message.trim()
  if (trimmedMessage.length < 3) {
    throw new Error('Please write at least 3 characters for your review.')
  }
  if (trimmedMessage.length > 500) {
    throw new Error('Review must be 500 characters or fewer.')
  }

  const username =
    input.anonymous || !input.username?.trim()
      ? null
      : input.username.trim().slice(0, 32)

  const payload = {
    username,
    message: trimmedMessage,
    rating: Math.min(5, Math.max(1, input.rating)),
  }

  if (!isSupabaseConfigured()) {
    const review: Review = {
      id: `local-${Date.now()}`,
      username,
      message: payload.message,
      rating: payload.rating,
      createdAt: new Date().toISOString(),
    }
    const next = [review, ...loadLocalReviews().filter((item) => !item.id.startsWith('seed-'))]
    saveLocalReviews(next)
    return review
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
    method: 'POST',
    headers: supabaseHeaders(),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Could not post your review. Please try again.')
  }

  const rows = (await response.json()) as Record<string, unknown>[]
  return mapRow(rows[0])
}
