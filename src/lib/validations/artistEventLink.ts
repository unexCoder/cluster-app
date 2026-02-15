import { z } from 'zod'

export const performanceLinkSchema = z.object({
  event_id: z.string().uuid('Must be a valid Event UUID'),
  artist_id: z.string().uuid('Must be a valid Artist UUID'),
  performance_order: z
    .number({ error: 'Performance order must be a number' })
    .int('Must be a whole number')
    .min(1, 'Order must be at least 1'),
})

export const performanceScheduleSchema = z.object({
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  soundcheck_time: z.string().optional(),
  set_duration_minutes: z
    .number({ error: 'Duration must be a number' })
    .int('Must be a whole number')
    .min(1, 'Duration must be at least 1 minute')
    .optional(),
}).refine(data => {
  if (data.start_time && data.end_time) {
    return new Date(data.end_time) > new Date(data.start_time)
  }
  return true
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
})

export const performanceDetailsSchema = z.object({
  stage: z.string().max(100, 'Stage name must be 100 characters or less').optional(),
  billing_position: z.enum(['headliner', 'co_headliner', 'support', 'opener']),
  backstage_access: z.enum(['full', 'limited', 'none']),
  rider_confirmed: z.boolean(),
  notes: z.string().max(2000, 'Notes must be 2000 characters or less').optional(),
})