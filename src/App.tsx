import { useState, useEffect, useRef } from 'react'

const HERO_IMG = 'https://images.unsplash.com/photo-1693996045300-521e9d08cabc?w=900&h=1100&fit=crop&auto=format'
const PRODUCT_BOTTLE = 'https://images.unsplash.com/photo-1739949381110-81f449e5a494?w=600&h=800&fit=crop&auto=format'

const BESTSELLERS = [
  {
    id: 1,
    name: 'Daily Greens Blend',
    subtitle: 'Organic Supergreens',
    price: 48,
    originalPrice: 62,
    img: 'https://images.unsplash.com/photo-1586191323955-0105fd538788?w=500&h=600&fit=crop&auto=format',
    tag: 'Best Seller',
  },
  {
    id: 2,
    name: 'Clean Protein',
    subtitle: 'Grass-Fed Whey',
    price: 64,
    originalPrice: 80,
    img: 'https://images.unsplash.com/photo-1693996045899-7cf0ac0229c7?w=500&h=600&fit=crop&auto=format',
    tag: 'New',
  },
  {
    id: 3,
    name: 'Adaptogen Tonic',
    subtitle: 'Ashwagandha + Reishi',
    price: 52,
    originalPrice: 68,
    img: 'https://images.unsplash.com/photo-1762626230231-8f5c55bf7cf5?w=500&h=600&fit=crop&auto=format',
    tag: 'Staff Pick',
  },
  {
    id: 4,
    name: 'Collagen Restore',
    subtitle: 'Marine Collagen Peptides',
    price: 56,
    originalPrice: 72,
    img: 'https://images.unsplash.com/photo-1779524477261-12141ccbd8d9?w=500&h=600&fit=crop&auto=format',
    tag: null,
  },
]

const WHY_ITEMS = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="20" cy="20" r="19" stroke="#7a9471" strokeWidth="1.5" />
        <path d="M12 20c2-5 6-8 8-8s6 3 8 8-6 12-8 12-8-7-8-12z" stroke="#7a9471" strokeWidth="1.5" fill="none" />
        <path d="M20 12v16M13 18h14" stroke="#7a9471" strokeWidth="1.2" />
      </svg>
    ),
    title: 'Sourced from Nature',
    body: 'Every ingredient is ethically sourced from certified organic farms. No fillers, no synthetics — just the earth at its purest.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="20" cy="20" r="19" stroke="#7a9471" strokeWidth="1.5" />
        <path d="M14 26l4-8 4 6 3-4 3 6" stroke="#7a9471" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="14" r="2" stroke="#7a9471" strokeWidth="1.2" />
      </svg>
    ),
    title: 'Clinically Formulated',
    body: 'Developed with leading nutritionists and backed by peer-reviewed research. Precise doses that actually move the needle.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="20" cy="20" r="19" stroke="#7a9471" strokeWidth="1.5" />
        <path d="M20 12l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z" stroke="#7a9471" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    title: 'Third-Party Tested',
    body: "Every batch is independently tested for purity and potency. What's on the label is what's in the jar — always.",
  },
]

type CartItem = {
  id: number
  name: string
  subtitle: string
  price: number
  img: string
  qty: number
}

type Page = 'home' | 'cart' | 'success'

function CartPage({
  cart,
  onBack,
  onQtyChange,
  onRemove,
  onPlaceOrder,
}: {
  cart: CartItem[]
  onBack: () => void
  onQtyChange: (id: number, delta: number) => void
  onRemove: (id: number) => void
  onPlaceOrder: () => void
}) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = subtotal > 75 ? 0 : 9.99
  const total = subtotal + shipping

  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.zip.trim()) e.zip = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onPlaceOrder()
  }

  return (
    <div className="min-h-screen" style={{ background: '#f5f0e8', color: '#2c2316' }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-40 flex items-center gap-4 px-6 py-4"
        style={{ background: 'rgba(245,240,232,0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(44,35,22,0.08)' }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-body text-sm hover:opacity-60 transition-opacity"
          style={{ fontWeight: 500, color: '#4a3f2f' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Continue Shopping
        </button>
        <span className="font-display text-xl ml-auto tracking-tight" style={{ fontWeight: 400 }}>
          <em>Verdant</em>
        </span>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_380px] gap-12 items-start">
        {/* Left: Bag + Checkout Form */}
        <div>
          <h1 className="font-display mb-8" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 300 }}>
            Your Bag
          </h1>

          {cart.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-body text-sm" style={{ color: '#7a9471', fontWeight: 300 }}>Your bag is empty.</p>
              <button
                onClick={onBack}
                className="mt-6 font-body text-xs uppercase tracking-widest px-8 py-3.5 transition-opacity hover:opacity-80"
                style={{ background: '#2c2316', color: '#f5f0e8', fontWeight: 500 }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="divide-y" style={{ borderTop: '1px solid rgba(44,35,22,0.1)', borderColor: 'rgba(44,35,22,0.1)' }}>
                {cart.map(item => (
                  <div key={item.id} className="flex gap-5 py-6">
                    <div className="w-24 h-28 shrink-0 overflow-hidden" style={{ background: '#e8e0d0' }}>
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-[10px] uppercase tracking-widest mb-1" style={{ color: '#7a9471', fontWeight: 500 }}>
                        {item.subtitle}
                      </p>
                      <h3 className="font-display mb-3" style={{ fontSize: '1.05rem', fontWeight: 400 }}>{item.name}</h3>
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center"
                          style={{ border: '1px solid rgba(44,35,22,0.2)' }}
                        >
                          <button
                            onClick={() => onQtyChange(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center font-body text-base hover:bg-black hover:bg-opacity-5 transition-colors"
                            style={{ fontWeight: 300 }}
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-body text-sm" style={{ fontWeight: 500 }}>{item.qty}</span>
                          <button
                            onClick={() => onQtyChange(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center font-body text-base hover:bg-black hover:bg-opacity-5 transition-colors"
                            style={{ fontWeight: 300 }}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="font-body text-xs hover:opacity-60 transition-opacity"
                          style={{ color: '#a89880', fontWeight: 400, textDecoration: 'underline' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-body font-medium text-sm">${(item.price * item.qty).toFixed(2)}</p>
                      {item.qty > 1 && (
                        <p className="font-body text-xs mt-0.5" style={{ color: '#a89880' }}>${item.price} each</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping notice */}
              {shipping > 0 ? (
                <p className="font-body text-xs mt-4 mb-10" style={{ color: '#7a9471', fontWeight: 400 }}>
                  Add ${(75 - subtotal).toFixed(2)} more for free shipping.
                </p>
              ) : (
                <p className="font-body text-xs mt-4 mb-10" style={{ color: '#7a9471', fontWeight: 500 }}>
                  ✓ You qualify for free shipping!
                </p>
              )}

              {/* Checkout Form */}
              <div style={{ borderTop: '1px solid rgba(44,35,22,0.1)', paddingTop: '2.5rem' }}>
                <h2 className="font-display mb-7" style={{ fontSize: '1.4rem', fontWeight: 300 }}>
                  Delivery Details
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { key: 'name', label: 'Full Name', colSpan: false },
                    { key: 'email', label: 'Email Address', colSpan: false },
                    { key: 'address', label: 'Street Address', colSpan: true },
                    { key: 'city', label: 'City', colSpan: false },
                    { key: 'zip', label: 'ZIP / Postal Code', colSpan: false },
                  ].map(({ key, label, colSpan }) => (
                    <div key={key} className={colSpan ? 'sm:col-span-2' : ''}>
                      <label className="block font-body text-xs uppercase tracking-[0.12em] mb-2" style={{ color: '#7a9471', fontWeight: 500 }}>
                        {label}
                      </label>
                      <input
                        type={key === 'email' ? 'email' : 'text'}
                        value={form[key as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full font-body text-sm px-4 py-3 outline-none focus:ring-1 transition-all"
                        style={{
                          background: '#fff',
                          border: errors[key] ? '1px solid #c97c5d' : '1px solid rgba(44,35,22,0.15)',
                          color: '#2c2316',
                          fontWeight: 300,
                          '--tw-ring-color': '#7a9471',
                        } as React.CSSProperties}
                      />
                      {errors[key] && (
                        <p className="font-body text-[11px] mt-1" style={{ color: '#c97c5d' }}>{errors[key]}</p>
                      )}
                    </div>
                  ))}

                  {/* Place Order (mobile: shown here inside form on small screens) */}
                  <div className="sm:col-span-2 lg:hidden mt-2">
                    <OrderSummaryBlock subtotal={subtotal} shipping={shipping} total={total} />
                    <button
                      type="submit"
                      className="w-full font-body py-4 text-sm uppercase tracking-widest transition-opacity hover:opacity-80 mt-6"
                      style={{ background: '#2c2316', color: '#f5f0e8', fontWeight: 500 }}
                    >
                      Place Order · ${total.toFixed(2)}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>

        {/* Right: Order Summary (desktop) */}
        {cart.length > 0 && (
          <div className="hidden lg:block sticky top-24">
            <div
              className="p-8"
              style={{ background: '#ede8de', border: '1px solid rgba(44,35,22,0.08)' }}
            >
              <h2 className="font-display mb-6" style={{ fontSize: '1.2rem', fontWeight: 400 }}>
                Order Summary
              </h2>
              <OrderSummaryBlock subtotal={subtotal} shipping={shipping} total={total} />
              <button
                onClick={handleSubmitDesktop}
                className="w-full font-body py-4 text-sm uppercase tracking-widest transition-opacity hover:opacity-80 mt-6"
                style={{ background: '#2c2316', color: '#f5f0e8', fontWeight: 500 }}
              >
                Place Order · ${total.toFixed(2)}
              </button>
              <p className="font-body text-[11px] text-center mt-4" style={{ color: '#a89880', fontWeight: 300 }}>
                Secure checkout · SSL encrypted
              </p>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              {[['Free Returns', '30 days'], ['Certified Organic', 'All batches'], ['Ships in 24h', 'Weekdays']].map(([t, s]) => (
                <div key={t}>
                  <p className="font-body text-[11px] font-medium" style={{ color: '#4a3f2f' }}>{t}</p>
                  <p className="font-body text-[10px]" style={{ color: '#a89880' }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  function handleSubmitDesktop() {
    if (validate()) onPlaceOrder()
  }
}

function OrderSummaryBlock({ subtotal, shipping, total }: { subtotal: number; shipping: number; total: number }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between font-body text-sm">
        <span style={{ color: '#4a3f2f', fontWeight: 300 }}>Subtotal</span>
        <span style={{ fontWeight: 500 }}>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-body text-sm">
        <span style={{ color: '#4a3f2f', fontWeight: 300 }}>Shipping</span>
        <span style={{ fontWeight: 500, color: shipping === 0 ? '#7a9471' : '#2c2316' }}>
          {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
        </span>
      </div>
      <div
        className="flex justify-between font-display pt-4"
        style={{ borderTop: '1px solid rgba(44,35,22,0.12)', fontSize: '1.1rem', fontWeight: 400 }}
      >
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  )
}

function SuccessPage({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center" style={{ background: '#f5f0e8', color: '#2c2316' }}>
      <div className="mb-8">
        <svg viewBox="0 0 72 72" fill="none" className="w-16 h-16 mx-auto mb-6">
          <circle cx="36" cy="36" r="35" stroke="#7a9471" strokeWidth="1.5" />
          <path d="M22 36l9 9 19-19" stroke="#7a9471" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 className="font-display mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300 }}>
          Order Placed.<br />
          <em style={{ fontStyle: 'italic' }}>Thank you.</em>
        </h1>
        <p className="font-body max-w-sm mx-auto" style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#4a3f2f', fontWeight: 300 }}>
          We have received your order and will have it shipped within 24 hours. A confirmation email is on its way.
        </p>
      </div>
      <button
        onClick={onContinue}
        className="font-body px-10 py-4 text-xs uppercase tracking-widest transition-opacity hover:opacity-80"
        style={{ background: '#2c2316', color: '#f5f0e8', fontWeight: 500 }}
      >
        Back to Shop
      </button>
    </div>
  )
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [page, setPage] = useState<Page>('home')
  const [stickyVisible, setStickyVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  const addToCart = (product: typeof BESTSELLERS[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { id: product.id, name: product.name, subtitle: product.subtitle, price: product.price, img: product.img, qty: 1 }]
    })
  }

  const addFeatured = () => addToCart(BESTSELLERS[1]) // Clean Protein as featured

  const handleShopNow = () => { //updated the shopnow function to add the featured product to the cart and navigate to the cart page
    addToCart(BESTSELLERS[1])
    setPage('cart')
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const handleQtyChange = (id: number, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
  }

  const handleRemove = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  const handlePlaceOrder = () => {
    setCart([])
    setPage('success')
  }

  if (page === 'cart') {
    return (
      <CartPage
        cart={cart}
        onBack={() => setPage('home')}
        onQtyChange={handleQtyChange}
        onRemove={handleRemove}
        onPlaceOrder={handlePlaceOrder}
      />
    )
  }

  if (page === 'success') {
    return <SuccessPage onContinue={() => setPage('home')} />
  }

  return (
    <div className="min-h-screen" style={{ background: '#f5f0e8', color: '#2c2316' }}>

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(245,240,232,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(44,35,22,0.08)' }}
      >
        <span className="font-display text-xl tracking-tight" style={{ fontWeight: 400, letterSpacing: '-0.01em' }}>
          <em>Verdant</em>
        </span>
        <div className="hidden md:flex gap-8 text-sm font-body" style={{ color: '#4a3f2f', fontWeight: 500 }}>
          <a href="#why" className="hover:opacity-60 transition-opacity">Why Us</a>
          <a href="#bestsellers" className="hover:opacity-60 transition-opacity">Products</a>
          <a href="#" className="hover:opacity-60 transition-opacity">Journal</a>
        </div>
        <button
          onClick={() => setPage('cart')}
          className="relative flex items-center gap-2 rounded-none px-5 py-2 text-sm font-body transition-opacity hover:opacity-80"
          style={{ background: '#2c2316', color: '#f5f0e8', fontWeight: 500, letterSpacing: '0.04em' }}
        >
          Bag
          {cartCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center rounded-full text-xs"
              style={{ background: '#7a9471', color: '#fff', fontSize: '10px' }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </nav>

      {/* Hero */}
      <section
        ref={heroRef}
        className="min-h-screen pt-16 grid md:grid-cols-2"
        style={{ background: '#f5f0e8' }}
      >
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-16 pb-12 md:py-24 order-2 md:order-1">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-6 font-body"
            style={{ color: '#7a9471', fontWeight: 500 }}
          >
            Premium Wellness — Est. 2019
          </p>
          <h1
            className="font-display mb-6 leading-[1.05]"
            style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)', fontWeight: 300, color: '#2c2316' }}
          >
            Nourish from<br />
            <em style={{ fontStyle: 'italic', fontWeight: 400 }}>the inside out.</em>
          </h1>
          <p
            className="font-body mb-10 max-w-sm"
            style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#4a3f2f', fontWeight: 300 }}
          >
            Whole-food formulas crafted for people who take their health seriously. No shortcuts. No compromise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleShopNow}
              className="font-body px-8 py-4 text-sm uppercase tracking-widest transition-opacity hover:opacity-80"
              style={{ background: '#2c2316', color: '#f5f0e8', fontWeight: 500 }}
            >
              Shop Now
            </button>
            <a
              href="#why"
              className="font-body px-8 py-4 text-sm uppercase tracking-widest text-center transition-opacity hover:opacity-60"
              style={{ border: '1px solid #2c2316', color: '#2c2316', fontWeight: 500 }}
            >
              Our Story
            </a>
          </div>
          <div className="mt-14 flex gap-10">
            {[['12k+', 'Customers'], ['97%', 'Satisfaction'], ['Zero', 'Fillers']].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-2xl" style={{ fontWeight: 400 }}>{n}</p>
                <p className="font-body text-xs uppercase tracking-wider mt-0.5" style={{ color: '#7a9471', fontWeight: 500 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative order-1 md:order-2 min-h-[50vh] md:min-h-screen overflow-hidden" style={{ background: '#e8e0d0' }}>
          <img
            src={HERO_IMG}
            alt="Verdant premium protein product"
            className="w-full h-full object-cover"
            style={{ minHeight: '400px' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(44,35,22,0.15))' }}
          />
          <div
            className="absolute bottom-8 left-8 right-8 font-body"
            style={{ color: '#f5f0e8', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}
          >
            Clean Protein — Vanilla Bean
          </div>
        </div>
      </section>

      {/* Marquee Strip */}
      <div className="overflow-hidden py-4" style={{ background: '#7a9471', color: '#f5f0e8' }}>
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {Array(6).fill(['Grass-Fed', 'Organic', 'Third-Party Tested', 'No Artificial Flavors', 'Carbon Neutral', 'Made in USA']).flat().map((t, i) => (
            <span key={i} className="font-body text-xs uppercase tracking-[0.18em] shrink-0" style={{ fontWeight: 500 }}>
              {t} <span className="opacity-50 mx-2">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <section id="why" className="px-8 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <p className="font-body text-xs uppercase tracking-[0.2em] mb-4" style={{ color: '#7a9471', fontWeight: 500 }}>
              The Verdant Difference
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 300, lineHeight: 1.1 }}>
              Why discerning people<br />
              <em style={{ fontStyle: 'italic' }}>choose us.</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="flex flex-col gap-5">
                {item.icon}
                <div className="w-12" style={{ height: '1px', background: '#c9b99a' }} />
                <h3 className="font-display text-xl" style={{ fontWeight: 400 }}>{item.title}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: '#4a3f2f', fontWeight: 300 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Break */}
      <div className="px-8 md:px-16 lg:px-24 py-20" style={{ background: '#2c2316', color: '#f5f0e8' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="font-display italic mb-6"
            style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 300, lineHeight: 1.4 }}
          >
            "I have tried every supplement on the market. Verdant is the only brand where I actually <em>feel</em> the difference."
          </p>
          <p className="font-body text-xs uppercase tracking-widest" style={{ color: '#7a9471', fontWeight: 500 }}>
            — Maya R., Yoga Instructor · Austin, TX
          </p>
        </div>
      </div>

      {/* Best Sellers Grid */}
      <section id="bestsellers" className="px-8 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#7a9471', fontWeight: 500 }}>
                Customer Favorites
              </p>
              <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300 }}>
                Best Sellers
              </h2>
            </div>
            <a
              href="#"
              className="font-body text-xs uppercase tracking-[0.15em] border-b pb-0.5 hover:opacity-60 transition-opacity"
              style={{ color: '#2c2316', borderColor: '#2c2316', fontWeight: 500 }}
            >
              View All Products
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {BESTSELLERS.map((product) => (
              <div key={product.id} className="group">
                <div className="relative overflow-hidden mb-4" style={{ background: '#e8e0d0', aspectRatio: '5/6' }}>
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {product.tag && (
                    <span
                      className="absolute top-3 left-3 font-body text-[10px] uppercase tracking-widest px-2.5 py-1"
                      style={{ background: '#7a9471', color: '#f5f0e8', fontWeight: 500 }}
                    >
                      {product.tag}
                    </span>
                  )}
                  <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-0 left-0 right-0 font-body text-xs uppercase tracking-widest py-3.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                    style={{ background: '#2c2316', color: '#f5f0e8', fontWeight: 500 }}
                  >
                    Add to Cart
                  </button>
                </div>
                <p className="font-body text-[10px] uppercase tracking-widest mb-1" style={{ color: '#7a9471', fontWeight: 500 }}>
                  {product.subtitle}
                </p>
                <h3 className="font-display mb-2" style={{ fontSize: '1.05rem', fontWeight: 400 }}>{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="font-body text-sm" style={{ fontWeight: 500 }}>${product.price}</span>
                  <span className="font-body text-xs line-through" style={{ color: '#a8c4a0', fontWeight: 400 }}>${product.originalPrice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ritual Section */}
      <section className="grid md:grid-cols-2 min-h-[60vh]" style={{ background: '#e8e0d0' }}>
        <div className="relative overflow-hidden min-h-[40vh] md:min-h-auto" style={{ background: '#d4c9b5' }}>
          <img
            src={PRODUCT_BOTTLE}
            alt="Verdant product ritual"
            className="w-full h-full object-cover"
            style={{ minHeight: '320px' }}
          />
        </div>
        <div className="flex flex-col justify-center px-10 md:px-16 py-16">
          <p className="font-body text-xs uppercase tracking-[0.2em] mb-5" style={{ color: '#7a9471', fontWeight: 500 }}>
            The Daily Ritual
          </p>
          <h2
            className="font-display mb-6 leading-tight"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 300 }}
          >
            Build the habit.<br />
            <em style={{ fontStyle: 'italic' }}>Feel the shift.</em>
          </h2>
          <p className="font-body mb-8 max-w-sm" style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#4a3f2f', fontWeight: 300 }}>
            Small, consistent rituals create lasting change. Our starter bundle makes it effortless to show up for yourself — every single day.
          </p>
          <button
            onClick={() => addToCart(BESTSELLERS[0])}
            className="font-body self-start px-8 py-4 text-xs uppercase tracking-widest transition-opacity hover:opacity-75"
            style={{ background: '#2c2316', color: '#f5f0e8', fontWeight: 500 }}
          >
            Shop the Starter Bundle
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-16 lg:px-24 py-16" style={{ background: '#2c2316', color: '#f5f0e8' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <span className="font-display text-2xl block mb-3" style={{ fontWeight: 300 }}>
              <em>Verdant</em>
            </span>
            <p className="font-body text-sm" style={{ color: '#a8c4a0', lineHeight: 1.7, maxWidth: '280px', fontWeight: 300 }}>
              Premium health and fitness supplements for people who do not settle. Sourced from earth. Backed by science.
            </p>
          </div>
          {[
            { heading: 'Shop', links: ['All Products', 'Best Sellers', 'Bundles', 'New Arrivals'] },
            { heading: 'Company', links: ['Our Story', 'Sustainability', 'Lab Results', 'Journal'] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <p className="font-body text-xs uppercase tracking-widest mb-4" style={{ color: '#7a9471', fontWeight: 500 }}>{heading}</p>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l}>
                    <a href="#" className="font-body text-sm hover:opacity-60 transition-opacity" style={{ fontWeight: 300 }}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="max-w-6xl mx-auto mt-14 pt-8 flex flex-col md:flex-row justify-between gap-4"
          style={{ borderTop: '1px solid rgba(245,240,232,0.1)' }}
        >
          <p className="font-body text-xs" style={{ color: '#7a9471', fontWeight: 300 }}>© 2026 Verdant. All rights reserved.</p>
          <p className="font-body text-xs" style={{ color: '#7a9471', fontWeight: 300 }}>Made with intention, somewhere on Earth.</p>
        </div>
      </footer>

      {/* Sticky Add to Cart Banner */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-out"
        style={{
          transform: stickyVisible ? 'translateY(0)' : 'translateY(100%)',
          background: '#f5f0e8',
          borderTop: '1px solid rgba(44,35,22,0.15)',
          boxShadow: '0 -8px 32px rgba(44,35,22,0.12)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 shrink-0 overflow-hidden" style={{ background: '#e8e0d0' }}>
              <img
                src="https://images.unsplash.com/photo-1693996045300-521e9d08cabc?w=80&h=80&fit=crop&auto=format"
                alt="Clean Protein"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm truncate" style={{ fontWeight: 400 }}>Clean Protein — Vanilla Bean</p>
              <p className="font-body text-xs" style={{ color: '#7a9471', fontWeight: 500 }}>$64 · 30 servings</p>
            </div>
          </div>
          <button
            onClick={addFeatured}
            className="font-body px-6 py-3 text-xs uppercase tracking-widest shrink-0 transition-opacity hover:opacity-80"
            style={{ background: '#2c2316', color: '#f5f0e8', fontWeight: 500 }}
          >
            Add to Cart {cartCount > 0 && `(${cartCount})`}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
