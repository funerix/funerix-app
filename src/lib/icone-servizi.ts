// Mappa icone centralizzata — coerenza in tutta l'app
// Ogni servizio ha UN'UNICA icona ovunque
import {
  Cross, // Servizio funebre (croce)
  Plane, // Rimpatri/Espatri
  PawPrint, // Cremazione animali (zampa)
  Shovel, // Esumazione
  ShoppingBag, // Catalogo prodotti
  Euro, // Prezzi
  BookOpen, // Guide
  Heart, // Memorial/Necrologi
  MessageCircle, // Assistenza/Chat
  Phone, // Contatti
  Users, // Chi siamo
  FileText, // Blog/Documenti
  Shield, // Autorizzazioni/Garanzie
  Clock, // Disponibilità 24/7
  Globe, // Internazionale
  Flame, // Cremazione
  Home, // Decesso in casa
  Building2, // Decesso in ospedale
  ScrollText, // Manifesto
  Calendar, // Calendario
  BarChart3, // Analytics
  Gift, // Referral
  Settings, // Impostazioni
  LayoutDashboard, // Dashboard
  Image, // Media
  Edit3, // Contenuti
  Building, // Agenzie
} from 'lucide-react'

// Servizi principali — usare SOLO queste icone
export const ICONE = {
  // Servizi core
  funebre: Cross,
  rimpatri: Plane,
  animali: PawPrint,
  esumazione: Shovel,
  catalogo: ShoppingBag,
  prezzi: Euro,

  // Sezioni sito
  guide: BookOpen,
  memorial: Heart,
  assistenza: MessageCircle,
  contatti: Phone,
  chiSiamo: Users,
  blog: FileText,

  // Valori
  autorizzazioni: Shield,
  disponibilita: Clock,
  internazionale: Globe,
  cremazione: Flame,

  // Scenari decesso
  decessoCasa: Home,
  decessoOspedale: Building2,
  decessoEstero: Globe,
  decessoRsa: Users,

  // Guide
  manifesto: ScrollText,
  documenti: FileText,

  // Admin
  dashboard: LayoutDashboard,
  calendario: Calendar,
  analytics: BarChart3,
  referral: Gift,
  impostazioni: Settings,
  media: Image,
  contenuti: Edit3,
  agenzie: Building,
}
