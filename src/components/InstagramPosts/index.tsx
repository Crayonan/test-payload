'use client'

import React, { useState } from 'react'
import { useAuth, Button } from '@payloadcms/ui'
import { useForm } from 'react-hook-form'

type FormData = {
  instagramUsername: string
}

export default function InstagramPosts() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      instagramUsername: process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME_TO_SCRAPE || '',
    },
  })

  const currentUsername = watch('instagramUsername')

  const handleFetch = async (data: FormData) => {
    if (!user) {
      setError('You must be logged in to perform this action.')
      return
    }

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/fetch-instagram-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          instagramUsername: data.instagramUsername,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(result.message || 'Instagram posts fetched successfully.')
      } else {
        setError(result.message || 'Error fetching posts.')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        marginBottom: '20px',
        padding: '20px',
        border: '1px solid var(--theme-elevation-300)',
        borderRadius: 'var(--style-radius-m, 4px)',
      }}
    >
      <h3 style={{ marginTop: 0 }}>Fetch Instagram Posts</h3>
      <p style={{ marginBottom: '15px' }}>
        Enter an Instagram username to fetch their latest public posts. You can perform one
        successful fetch per username per day.
      </p>
      <form onSubmit={handleSubmit(handleFetch)}>
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="instagramUsernameFetch"
            style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
          >
            Instagram Username
          </label>
          <input
            id="instagramUsernameFetch"
            type="text"
            {...register('instagramUsername', { required: 'Username is required' })}
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '400px',
              padding: '10px',
              border: formErrors.instagramUsername
                ? '1px solid var(--theme-error-500)'
                : '1px solid var(--theme-elevation-400)',
              borderRadius: 'var(--style-radius-m, 4px)',
              backgroundColor: 'var(--theme-elevation-0)',
              color: 'var(--theme-text)',
            }}
          />
          {formErrors.instagramUsername && (
            <p
              style={{ color: 'var(--theme-error-500)', fontSize: '0.875em', marginTop: '0.25rem' }}
            >
              {formErrors.instagramUsername.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || !currentUsername}
          buttonStyle="primary"
          el="button"
        >
          {loading ? 'Fetching...' : `Fetch Posts for ${currentUsername || '...'}`}
        </Button>
      </form>
      {message && <p style={{ color: 'var(--theme-success-500)', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'var(--theme-error-500)', marginTop: '1rem' }}>{error}</p>}
    </div>
  )
}
