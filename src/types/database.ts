export interface Deal {
  id: string
  brand: string | null
  value: number | null
  status: string | null
  deadline: string | null
  user_id: string | null
}

export interface Payment {
  id: string
  deal_id: string | null
  amount: number | null
  status: string | null
  due_date: string | null
  received_date: string | null
}

export interface RevenueRecord {
  id: string
  source: string
  payment_id: string | null
  platform: string
  amount: number
  date: string
  notes: string | null
  user_id: string | null
  created_at: string
}
