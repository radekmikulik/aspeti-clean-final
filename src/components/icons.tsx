// Mock ikony pro nahrazení lucide-react
import React from 'react'

interface IconProps {
  className?: string
  size?: number
  style?: React.CSSProperties
}

export const X = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>×</span>
)

export const Mail = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>@</span>
)

export const Lock = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🔒</span>
)

export const User = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>👤</span>
)

export const Loader2 = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block animate-spin ${className}`} style={{ fontSize: size, ...style }}>⟳</span>
)

// Další ikony pro ostatní komponenty
export const GripVertical = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>⋮⋮</span>
)

export const Plus = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>+</span>
)

export const Trash2 = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🗑</span>
)

export const Type = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>T</span>
)

export const Image = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🖼</span>
)

export const Edit3 = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>✏</span>
)

export const Check = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>✓</span>
)

export const Upload = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>⬆</span>
)

// Často používané ikony
export const Star = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>⭐</span>
)

export const Heart = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>❤️</span>
)

export const Eye = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>👁</span>
)

export const Edit = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>✏</span>
)

export const Save = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>💾</span>
)

export const Search = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🔍</span>
)

export const Calendar = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📅</span>
)

export const Clock = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🕐</span>
)

export const MapPin = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📍</span>
)

export const Phone = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📞</span>
)

export const Globe = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🌐</span>
)

export const Settings = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>⚙</span>
)

export const Menu = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>☰</span>
)

export const Home = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🏠</span>
)

export const BarChart3 = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📊</span>
)

export const TrendingUp = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📈</span>
)

export const DollarSign = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>$</span>
)

export const CreditCard = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>💳</span>
)

export const MessageCircle = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>💬</span>
)

export const Bell = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🔔</span>
)

export const LogOut = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🚪</span>
)

export const RefreshCw = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block animate-spin ${className}`} style={{ fontSize: size, ...style }}>🔄</span>
)

export const ExternalLink = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🔗</span>
)

export const AlertTriangle = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>⚠</span>
)

export const TrendingDown = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📉</span>
)

export const ChevronRight = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>›</span>
)

export const ChevronLeft = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>‹</span>
)

export const ChevronDown = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>▼</span>
)

export const ChevronUp = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>▲</span>
)

export const Filter = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🔍</span>
)

export const MoreVertical = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>⋮</span>
)

export const MoreHorizontal = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>⋯</span>
)

export const ArrowLeft = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>←</span>
)

export const ArrowRight = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>→</span>
)

export const Download = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>⬇</span>
)

export const Copy = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📋</span>
)

export const Share2 = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🔗</span>
)

export const Bookmark = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🔖</span>
)

export const Tag = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🏷</span>
)

export const FileText = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📄</span>
)

export const Folder = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📁</span>
)

export const FolderOpen = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📂</span>
)

export const Minus = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>-</span>
)

export const Info = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>ℹ</span>
)

export const HelpCircle = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>❓</span>
)

export const AlertCircle = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>⚪</span>
)

export const CheckCircle = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>✅</span>
)

export const XCircle = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>❌</span>
)

export const Play = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>▶</span>
)

export const Pause = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>⏸</span>
)

export const Square = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>■</span>
)

export const Circle = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>●</span>
)

export const Triangle = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>▲</span>
)

export const Diamond = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>◆</span>
)

export const Hexagon = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>⬡</span>
)

export const Octagon = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>⬟</span>
)

export const Zap = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>⚡</span>
)

export const Shield = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🛡</span>
)

export const Award = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🏆</span>
)

export const Target = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🎯</span>
)

export const Compass = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🧭</span>
)

export const Navigation = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🧭</span>
)

export const Wind = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>💨</span>
)

export const Droplet = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>💧</span>
)

export const Snowflake = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>❄</span>
)

export const Flame = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🔥</span>
)

export const Moon = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🌙</span>
)

export const Sun = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>☀️</span>
)

export const Cloud = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>☁</span>
)

export const CloudRain = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🌧</span>
)

export const CloudSnow = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🌨</span>
)

export const CloudDrizzle = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🌦</span>
)

export const CloudLightning = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>⛈</span>
)

export const Package = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📦</span>
)

export const Archive = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📦</span>
)

export const EyeOff = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🙈</span>
)

export const Grid3X3 = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>▦</span>
)

export const List = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>☰</span>
)

export const Layers = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>▭</span>
)

export const Box = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>▢</span>
)

export const Cube = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>⬛</span>
)

export const Layers3 = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>▮</span>
)

export const AppWindow = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🪟</span>
)

export const Smartphone = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📱</span>
)

export const Tablet = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📱</span>
)

export const Monitor = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🖥</span>
)

export const Laptop = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>💻</span>
)

export const HardDrive = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>💾</span>
)

export const Cpu = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🖱</span>
)

export const MemoryStick = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🧮</span>
)

export const Battery = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🔋</span>
)

export const Wifi = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📶</span>
)

export const Bluetooth = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📶</span>
)

export const Camera = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📷</span>
)

export const Instagram = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📷</span>
)

export const Facebook = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📘</span>
)

export const Twitter = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🐦</span>
)

export const Youtube = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📺</span>
)

export const Linkedin = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>💼</span>
)

export const Github = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🐙</span>
)

export const MessageSquare = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>💬</span>
)

export const Send = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📤</span>
)

export const Reply = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>↩</span>
)

export const Forward = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>↪</span>
)

export const Paperclip = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>📎</span>
)

export const AtSign = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>@</span>
)

export const Hash = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>#</span>
)

export const Percent = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>%</span>
)

export const DollarSign2 = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>$</span>
)

export const Euro = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>€</span>
)

export const Pound = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>£</span>
)

export const Yen = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>¥</span>
)

export const Bitcoin = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>₿</span>
)

export const Crown = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>👑</span>
)

export const Gem = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>💎</span>
)

export const Diamond2 = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🔷</span>
)

export const Ruby = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>💎</span>
)

export const Sparkles = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>✨</span>
)

export const Globe2 = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🌍</span>
)

export const Users = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>👥</span>
)

export const Building = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🏢</span>
)

export const Car = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🚗</span>
)

export const Bike = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🚴</span>
)

export const Train = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🚆</span>
)

export const Plane = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>✈️</span>
)

export const Ship = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🚢</span>
)

export const Calculator = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🧮</span>
)

export const Edit2 = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>✏️</span>
)

export const MousePointer = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🖱️</span>
)

export const Rainbow = ({ className = "", size = 16, style }: IconProps) => (
  <span className={`inline-block ${className}`} style={{ fontSize: size, ...style }}>🌈</span>
)
