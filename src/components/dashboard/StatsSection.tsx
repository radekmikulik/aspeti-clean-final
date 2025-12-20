import { useState } from 'react'
import { Eye, MousePointer, Phone, Globe, Calendar, Star, MessageSquare, TrendingUp, Send, Loader2 } from '@/components/icons'
import { supabase, Provider, Offer, Review } from '../../lib/supabase'

interface StatsSectionProps {
  provider: Provider
  offers: Offer[]
  reviews: Review[]
  onRefresh: () => void
}

export function StatsSection({ provider, offers, reviews, onRefresh }: StatsSectionProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  const totalViews = offers.reduce((sum, o) => sum + (o.views_count || 0), 0)
  const totalClicks = offers.reduce((sum, o) => sum + (o.clicks || 0), 0)
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  const submitReply = async (reviewId: string) => {
    if (!replyText.trim()) return
    setSending(true)
    await supabase.from('provider_reviews').update({
      provider_response: replyText,
      response_at: new Date().toISOString()
    }).eq('id', reviewId)
    setSending(false)
    setReplyingTo(null)
    setReplyText('')
    onRefresh()
  }

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )

  // Mock data for charts
  const weeklyData = [
    { day: 'Po', views: 45, clicks: 12 },
    { day: 'Ut', views: 52, clicks: 15 },
    { day: 'St', views: 38, clicks: 8 },
    { day: 'Ct', views: 61, clicks: 18 },
    { day: 'Pa', views: 55, clicks: 14 },
    { day: 'So', views: 72, clicks: 22 },
    { day: 'Ne', views: 48, clicks: 11 },
  ]

  const maxViews = Math.max(...weeklyData.map(d => d.views))

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalViews}</div>
          <div className="text-sm text-gray-500">Zobrazeni celkem</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <MousePointer className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +8%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalClicks}</div>
          <div className="text-sm text-gray-500">Prokliku celkem</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{avgRating}</span>
            <span className="text-gray-500">/5</span>
          </div>
          <div className="text-sm text-gray-500">{reviews.length} hodnoceni</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{offers.filter(o => o.is_active).length}</div>
          <div className="text-sm text-gray-500">Aktivnich nabidek</div>
        </div>
      </div>

      {/* Charts and Reviews */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-6">Tydenni prehled</h3>
          <div className="space-y-3">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex items-center gap-3">
                <span className="w-8 text-sm text-gray-500">{day.day}</span>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden flex items-center">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#4a7a66] rounded-lg transition-all"
                    style={{ width: `${(day.views / maxViews) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-sm text-gray-600 text-right">{day.views}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-600" />
              <span className="text-sm text-gray-500">Zobrazeni</span>
            </div>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-6">Rozlozeni hodnoceni</h3>
          <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-emerald-600">{avgRating}</div>
              <div className="flex justify-center mt-2">{renderStars(Math.round(Number(avgRating)))}</div>
              <div className="text-sm text-gray-500 mt-1">{reviews.length} recenzi</div>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter(r => r.rating === stars).length
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="w-4 text-sm text-gray-500">{stars}</span>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-sm text-gray-500 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recenze od zakazniku</h3>
        </div>
        
        {reviews.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                      {review.client_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{review.client_name}</h4>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('cs-CZ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {review.review_text && (
                  <p className="text-gray-600 mb-4">{review.review_text}</p>
                )}
                
                {review.provider_response ? (
                  <div className="ml-6 p-4 bg-emerald-100 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium mb-2">
                      <MessageSquare className="w-4 h-4" />
                      Vase odpoved
                    </div>
                    <p className="text-gray-600">{review.provider_response}</p>
                  </div>
                ) : replyingTo === review.id ? (
                  <div className="ml-6">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Napiste odpoved..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button 
                        onClick={() => { setReplyingTo(null); setReplyText('') }}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        Zrusit
                      </button>
                      <button
                        onClick={() => submitReply(review.id)}
                        disabled={sending || !replyText.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Odeslat
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyingTo(review.id)}
                    className="ml-6 flex items-center gap-2 text-sm text-emerald-600 hover:underline"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Odpovedet
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>Zatim zadne recenze</p>
          </div>
        )}
      </div>
    </div>
  )
}
