export interface Review {
  id: string
  username: string | null
  message: string
  rating: number
  createdAt: string
}

export interface NewReview {
  username: string | null
  message: string
  rating: number
  anonymous: boolean
}

export type ReviewStorageMode = 'supabase' | 'local'
