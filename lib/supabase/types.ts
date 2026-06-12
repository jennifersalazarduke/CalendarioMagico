export interface Profile {
  id: string
  display_name: string
  role: 'parent' | 'child'
  family_id: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Family {
  id: string
  name: string
  invite_code: string
  theme: 'pink' | 'blue'
  created_by: string
  created_at: string
}

export interface Child {
  id: string
  family_id: string
  name: string
  theme: 'pink' | 'blue'
  created_at: string
}

export interface Routine {
  id: string
  child_id: string
  block_id: string
  title: string
  icon: string
  bg_color: string
  accent_color: string
  sort_order: number
  created_at: string
}

export interface DbActivity {
  id: string
  routine_id: string
  name_es: string
  name_en: string
  icon: string
  sort_order: number
  created_at: string
}

export interface Completion {
  id: string
  child_id: string
  activity_id: string
  completed_date: string
  tokens_earned: number
  created_at: string
}

export interface TokenTransaction {
  id: string
  child_id: string
  amount: number
  reason: 'activity' | 'routine_bonus' | 'day_bonus' | 'redemption' | 'consequence'
  reference_id: string | null
  created_at: string
}

export interface DbReward {
  id: string
  family_id: string
  name_es: string
  icon: string
  price: number
  is_active: boolean
  created_at: string
}

export interface Redemption {
  id: string
  child_id: string
  reward_id: string
  tokens_spent: number
  redeemed_at: string
}
