import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Clock3,
  Database,
  Layers3,
  Radar,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const statCards = [
  { title: 'Wallets Tracked', value: '247', delta: '+18 this week', icon: Wallet },
  { title: 'Trades Seen', value: '18.4k', delta: '+1.2k today', icon: Activity },
  { title: 'Trust Scoring', value: 'Hourly', delta: 'Last run 12 min ago', icon: ShieldCheck },
  { title: 'System Freshness', value: 'Healthy', delta: 'Collectors active', icon: Radar },
]

const keyTables = [
  {
    name: 'polymarket_wallets',
    purpose: 'Tracked wallets and leaderboard metadata',
    cadence: '~1 hour',
  },
  {
    name: 'polymarket_trades_seen',
    purpose: 'Normalized trade feed for monitored wallets',
    cadence: '~30 sec',
  },
  {
    name: 'polymarket_wallet_metrics',
    purpose: 'Trust score history and wallet-level performance metrics',
    cadence: '~1 hour',
  },
  {
    name: 'polymarket_activity_seen',
    purpose: 'Recent wallet activity and non-trade feed events',
    cadence: '~30 sec',
  },
  {
    name: 'polymarket_positions_snapshot',
    purpose: 'Open positions snapshots by wallet',
    cadence: '~5 min',
  },
  {
    name: 'polymarket_closed_positions_snapshot',
    purpose: 'Closed positions snapshots for performance review',
    cadence: '~5 min',
  },
]

const trustTrend = [
  { date: 'Mon', w1: 92, w2: 89, w3: 87, w4: 84, w5: 81, w6: 79, w7: 77, w8: 75, w9: 73, w10: 71 },
  { date: 'Tue', w1: 93, w2: 88, w3: 88, w4: 84, w5: 82, w6: 78, w7: 78, w8: 76, w9: 74, w10: 72 },
  { date: 'Wed', w1: 94, w2: 89, w3: 87, w4: 85, w5: 83, w6: 79, w7: 79, w8: 77, w9: 73, w10: 73 },
  { date: 'Thu', w1: 92, w2: 90, w3: 88, w4: 86, w5: 82, w6: 80, w7: 78, w8: 78, w9: 74, w10: 72 },
  { date: 'Fri', w1: 93, w2: 91, w3: 89, w4: 85, w5: 83, w6: 81, w7: 79, w8: 77, w9: 75, w10: 73 },
  { date: 'Sat', w1: 94, w2: 90, w3: 90, w4: 86, w5: 84, w6: 82, w7: 80, w8: 78, w9: 76, w10: 74 },
  { date: 'Sun', w1: 95, w2: 92, w3: 91, w4: 87, w5: 85, w6: 83, w7: 81, w8: 79, w9: 77, w10: 75 },
]

const ingestionData = [
  { label: 'Trades', records: 1240 },
  { label: 'Activity', records: 860 },
  { label: 'Positions', records: 430 },
  { label: 'Closed', records: 290 },
  { label: 'Metrics', records: 120 },
  { label: 'Wallets', records: 34 },
]

const freshnessData = [
  { time: '08:00', lag: 38 },
  { time: '10:00', lag: 24 },
  { time: '12:00', lag: 17 },
  { time: '14:00', lag: 21 },
  { time: '16:00', lag: 12 },
  { time: '18:00', lag: 14 },
  { time: '20:00', lag: 10 },
]

const portfolioMix = [
  { name: 'Politics', value: 34 },
  { name: 'Crypto', value: 24 },
  { name: 'Sports', value: 18 },
  { name: 'Macro', value: 14 },
  { name: 'Other', value: 10 },
]

const pieColors = ['#0f766e', '#115e59', '#1d4ed8', '#334155', '#94a3b8']

const topWallets = [
  { rank: 1, wallet: '0x8e43...a3cd', trust: 92, pnl: '+$4,280', volume: '$28.4k' },
  { rank: 2, wallet: '0x47a1...1d09', trust: 89, pnl: '+$2,940', volume: '$21.1k' },
  { rank: 3, wallet: '0x12bc...72fe', trust: 86, pnl: '+$1,870', volume: '$19.7k' },
  { rank: 4, wallet: '0xa93f...91de', trust: 82, pnl: '+$1,120', volume: '$14.6k' },
  { rank: 5, wallet: '0x55d2...3b11', trust: 78, pnl: '+$740', volume: '$10.2k' },
  { rank: 6, wallet: '0x1f3b...4a91', trust: 76, pnl: '+$510', volume: '$9.8k' },
  { rank: 7, wallet: '0x9ab4...fe20', trust: 74, pnl: '+$430', volume: '$8.4k' },
  { rank: 8, wallet: '0x4de8...b771', trust: 72, pnl: '+$260', volume: '$7.7k' },
  { rank: 9, wallet: '0xc201...7d44', trust: 70, pnl: '+$150', volume: '$6.9k' },
  { rank: 10, wallet: '0x77fa...8c52', trust: 68, pnl: '+$95', volume: '$6.1k' },
]

const trustLineKeys = [
  { key: 'w1', label: '1', color: '#2dd4bf' },
  { key: 'w2', label: '2', color: '#38bdf8' },
  { key: 'w3', label: '3', color: '#60a5fa' },
  { key: 'w4', label: '4', color: '#818cf8' },
  { key: 'w5', label: '5', color: '#a78bfa' },
  { key: 'w6', label: '6', color: '#f472b6' },
  { key: 'w7', label: '7', color: '#fb7185' },
  { key: 'w8', label: '8', color: '#f59e0b' },
  { key: 'w9', label: '9', color: '#facc15' },
  { key: 'w10', label: '10', color: '#4ade80' },
]

const recentTrades = [
  { wallet: '0x8e43...a3cd', market: 'BTC above 110k by Friday', side: 'YES', size: '$420', age: '18 sec' },
  { wallet: '0x47a1...1d09', market: 'Fed cut in March', side: 'NO', size: '$185', age: '41 sec' },
  { wallet: '0x12bc...72fe', market: 'ETH ETF inflows positive', side: 'YES', size: '$320', age: '1 min' },
  { wallet: '0xa93f...91de', market: 'NBA finals series price', side: 'NO', size: '$95', age: '2 min' },
  { wallet: '0x55d2...3b11', market: 'US election market swing', side: 'YES', size: '$610', age: '3 min' },
]

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="section-header">
      <div className="section-left">
        <div className="section-icon">
          <Icon size={18} />
        </div>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      <span className="badge muted">Demo data</span>
    </div>
  )
}

function Card({ children, className = '' }) {
  return <div className={`card ${className}`.trim()}>{children}</div>
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      {payload.map((item) => (
        <div className="chart-tooltip-row" key={`${item.name}-${item.dataKey}`}>
          <span className="chart-dot" style={{ backgroundColor: item.color }} />
          <span>{item.name}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const formattedUpdated = useMemo(
    () =>
      lastUpdated.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      }),
    [lastUpdated],
  )

  const handleRefresh = () => {
    setLastUpdated(new Date())
  }

  return (
    <div className="app-shell">
      <div className="page-wrap">
        <motion.header
          className="hero card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="hero-main">
            <div className="brand-lockup">
              <div className="brand-mark">
                <img src="/logo.png" alt="Copyflow logo" />
              </div>
              <div>
                <div className="hero-title-row">
                  <h1>Copyflow Dashboard</h1>
                  <span className="badge accent">Prototype</span>
                </div>
                <p>
                  Public-facing view for wallet rankings, trust scoring, positions, and live collection health.
                </p>
              </div>
            </div>
            <div className="hero-actions">
              <div className="info-pill">
                <span className="eyebrow">VPS</span>
                <strong>45.77.111.121 • Ubuntu 24.04</strong>
              </div>
              <div className="info-pill">
                <span className="eyebrow">Last Updated</span>
                <strong>{formattedUpdated}</strong>
              </div>
              <button className="btn btn-secondary" onClick={handleRefresh}>
                <RefreshCw size={16} />
                Refresh Data
              </button>
              <button className="btn btn-primary">
                View Live Status
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </motion.header>

        <section className="stat-grid">
          {statCards.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card>
                  <div className="stat-card">
                    <div>
                      <div className="stat-label">{item.title}</div>
                      <div className="stat-value">{item.value}</div>
                      <div className="stat-delta">{item.delta}</div>
                    </div>
                    <div className="stat-icon">
                      <Icon size={18} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </section>

        <section className="grid-two-top">
          <Card>
            <div className="card-pad">
              <SectionHeader
                icon={ShieldCheck}
                title="Top 10 Wallet Trust Trends"
                subtitle="Leaderboard table on top with multi-wallet trust score history underneath"
              />
              <div className="table-shell">
                <div className="table-head four-cols">
                  <div>Rank</div>
                  <div>Wallet</div>
                  <div>Trust</div>
                  <div>Volume</div>
                </div>
                {topWallets.map((row) => (
                  <div className="table-row four-cols" key={row.rank}>
                    <div className="soft">#{row.rank}</div>
                    <div className="mono">{row.wallet}</div>
                    <div className="strong">{row.trust}</div>
                    <div className="soft">{row.volume}</div>
                  </div>
                ))}
              </div>

              <div className="chart-box tall-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trustTrend}>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis
                      domain={[65, 100]}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {trustLineKeys.map((item) => (
                      <Line
                        key={item.key}
                        type="monotone"
                        dataKey={item.key}
                        name={`Wallet ${item.label}`}
                        stroke={item.color}
                        strokeWidth={2.15}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="legend-pills">
                {trustLineKeys.map((item) => (
                  <div className="legend-pill" key={item.key}>
                    <span className="legend-swatch" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="card-pad">
              <SectionHeader
                icon={Layers3}
                title="Market Mix"
                subtitle="Example allocation across active tracked markets"
              />
              <div className="chart-box pie-box">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioMix}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {portfolioMix.map((entry, index) => (
                        <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mix-grid">
                {portfolioMix.map((item, index) => (
                  <div className="mix-pill" key={item.name}>
                    <span className="legend-swatch" style={{ backgroundColor: pieColors[index % pieColors.length] }} />
                    <span>{item.name}</span>
                    <strong>{item.value}%</strong>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section className="grid-two-bottom">
          <Card>
            <div className="card-pad">
              <SectionHeader
                icon={Database}
                title="Core Project Tables"
                subtitle="These are the first tables I would expose through a read-only API"
              />
              <div className="stack-list">
                {keyTables.map((table) => (
                  <div className="list-card" key={table.name}>
                    <div>
                      <div className="mono teal">{table.name}</div>
                      <div className="subcopy">{table.purpose}</div>
                    </div>
                    <span className="badge muted">{table.cadence}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="card-pad">
              <SectionHeader
                icon={BarChart3}
                title="Ingestion Volume"
                subtitle="Mock record counts by feed so you can visualize collection activity"
              />
              <div className="chart-box medium-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ingestionData}>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="records" name="Records" fill="#14b8a6" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid-two-bottom">
          <Card>
            <div className="card-pad">
              <SectionHeader
                icon={Clock3}
                title="Collector Freshness"
                subtitle="Lag in seconds between expected and observed updates"
              />
              <div className="chart-box short-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={freshnessData}>
                    <defs>
                      <linearGradient id="lagFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="lag" name="Lag (sec)" stroke="#38bdf8" fill="url(#lagFill)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          <Card>
            <div className="card-pad">
              <SectionHeader
                icon={Wallet}
                title="Top Wallets"
                subtitle="High-level leaderboard view for the public site"
              />
              <div className="stack-list">
                {topWallets.slice(0, 5).map((row) => (
                  <div className="wallet-row" key={row.rank}>
                    <div className="rank-chip">#{row.rank}</div>
                    <div className="wallet-meta">
                      <div className="mono">{row.wallet}</div>
                      <div className="subcopy">Volume {row.volume}</div>
                    </div>
                    <div className="wallet-stats">
                      <strong>Trust {row.trust}</strong>
                      <span>{row.pnl}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section>
          <Card>
            <div className="card-pad">
              <SectionHeader
                icon={Activity}
                title="Recent Trades"
                subtitle="Simple feed layout for the first public-facing activity table"
              />
              <div className="table-shell">
                <div className="table-head five-cols">
                  <div>Wallet</div>
                  <div>Market</div>
                  <div>Side</div>
                  <div>Size</div>
                  <div>Age</div>
                </div>
                {recentTrades.map((trade) => (
                  <div className="table-row five-cols" key={`${trade.wallet}-${trade.market}`}>
                    <div className="mono">{trade.wallet}</div>
                    <div>{trade.market}</div>
                    <div>
                      <span className={`badge ${trade.side === 'YES' ? 'success' : 'danger'}`}>{trade.side}</span>
                    </div>
                    <div>{trade.size}</div>
                    <div className="soft">{trade.age}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
