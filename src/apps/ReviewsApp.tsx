import { useCallback, useEffect, useState } from 'react'
import {
  fetchReviews,
  getReviewStorageMode,
  submitReview,
} from '../services/reviewService'
import type { Review } from '../types/review'

function formatDate(value: string) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="review-stars" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  )
}

export function ReviewsApp() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [username, setUsername] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const storageMode = getReviewStorageMode()

  const loadReviews = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchReviews()
      setReviews(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load reviews.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const review = await submitReview({
        username,
        message,
        rating,
        anonymous,
      })
      setReviews((prev) => [review, ...prev.filter((item) => item.id !== review.id)])
      setMessage('')
      setSuccess('Thanks! Your review has been posted.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not post review.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app-content reviews-app">
      <div className="reviews-header">
        <div>
          <h2>Guest Book</h2>
          <p>Leave a review about this portfolio — use your name or post anonymously.</p>
        </div>
        <button type="button" className="xp-button" onClick={loadReviews} disabled={loading}>
          Refresh
        </button>
      </div>

      {storageMode === 'local' && (
        <p className="reviews-notice">
          Demo mode: reviews are saved in this browser only. Add Supabase keys to share
          reviews with all visitors.
        </p>
      )}

      <form className="review-form" onSubmit={handleSubmit}>
        <fieldset className="review-fieldset">
          <legend>Write a review</legend>

          <label className="review-label">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            Post anonymously
          </label>

          {!anonymous && (
            <label className="review-label">
              Your name
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Alex"
                maxLength={32}
              />
            </label>
          )}

          <label className="review-label">
            Rating
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value={5}>★★★★★ Excellent</option>
              <option value={4}>★★★★☆ Great</option>
              <option value={3}>★★★☆☆ Good</option>
              <option value={2}>★★☆☆☆ Fair</option>
              <option value={1}>★☆☆☆☆ Poor</option>
            </select>
          </label>

          <label className="review-label">
            Your review
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What did you think of this portfolio?"
              rows={4}
              maxLength={500}
              required
            />
          </label>

          <div className="review-form-actions">
            <button type="submit" className="xp-button" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Review'}
            </button>
            <span className="review-char-count">{message.length}/500</span>
          </div>
        </fieldset>
      </form>

      {success && <p className="reviews-success">{success}</p>}
      {error && <p className="reviews-error">{error}</p>}

      <div className="reviews-list">
        <h3>Visitor Reviews ({reviews.length})</h3>
        {loading ? (
          <p className="reviews-empty">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="reviews-empty">No reviews yet. Be the first to leave one!</p>
        ) : (
          <ul>
            {reviews.map((review) => (
              <li key={review.id} className="review-card">
                <div className="review-card-header">
                  <strong>{review.username ?? 'Anonymous'}</strong>
                  <Stars rating={review.rating} />
                </div>
                <p className="review-card-message">{review.message}</p>
                <time className="review-card-date" dateTime={review.createdAt}>
                  {formatDate(review.createdAt)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
