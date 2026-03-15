import { FormEvent, useEffect, useMemo, useState } from 'react'

type Language = 'en' | 'tr'
type AuthMode = 'login' | 'signup'

type User = {
  id: string
  name: string
  email: string
  password: string
  bio: string
  createdAt: string
}

type Story = {
  id: string
  authorId: string
  authorName: string
  title: string
  decision: string
  location: string
  timeline: string
  outcome: string
  lesson: string
  tags: string[]
  createdAt: string
}

type Copy = {
  nav: {
    story: string
    how: string
    useCases: string
    explore: string
    auth: string
    dashboard: string
  }
  hero: {
    badge: string
    title: string
    titleAccent: string
    description: string
    primary: string
    secondary: string
    proof: string[]
  }
  spotlight: {
    label: string
    title: string
    description: string
    cards: Array<{ eyebrow: string; text: string }>
  }
  steps: {
    eyebrow: string
    title: string
    items: Array<{ title: string; text: string }>
  }
  reasons: {
    eyebrow: string
    title: string
    items: Array<{ title: string; text: string }>
  }
  useCases: {
    eyebrow: string
    title: string
    items: Array<{ title: string; text: string }>
  }
  app: {
    liveBadge: string
    liveTitle: string
    liveDescription: string
    composerLocked: string
    composerReady: string
    emptyStories: string
    byLabel: string
    timelineLabel: string
    outcomeLabel: string
    lessonLabel: string
    tagsLabel: string
    seededNote: string
  }
  auth: {
    eyebrow: string
    title: string
    description: string
    loginTab: string
    signupTab: string
    name: string
    email: string
    password: string
    bio: string
    loginButton: string
    signupButton: string
    logoutButton: string
    welcome: string
    loggedInAs: string
    loginSuccess: string
    signupSuccess: string
    invalidLogin: string
    emailTaken: string
    passwordRule: string
    requiredRule: string
  }
  composer: {
    eyebrow: string
    title: string
    description: string
    titleLabel: string
    decisionLabel: string
    locationLabel: string
    timelineLabel: string
    outcomeLabel: string
    lessonLabel: string
    tagsLabel: string
    submitButton: string
    success: string
    helper: string
  }
  dashboard: {
    eyebrow: string
    title: string
    description: string
    storyCount: string
    memberSince: string
    noStories: string
    delete: string
  }
  footer: string
}

const USERS_KEY = 'outcomee-users'
const STORIES_KEY = 'outcomee-stories'
const SESSION_KEY = 'outcomee-session'

const seededUsers: User[] = [
  {
    id: 'seed-user-1',
    name: 'Selin Arman',
    email: 'selin@outcomee.app',
    password: 'demo123',
    bio: 'Product designer who moved to Amsterdam after six years in Istanbul.',
    createdAt: '2025-11-15T09:30:00.000Z',
  },
  {
    id: 'seed-user-2',
    name: 'Mert Kaya',
    email: 'mert@outcomee.app',
    password: 'demo123',
    bio: 'Former consultant turned indie founder with a focus on calm software.',
    createdAt: '2025-12-03T11:45:00.000Z',
  },
]

const seededStories: Story[] = [
  {
    id: 'seed-story-1',
    authorId: 'seed-user-1',
    authorName: 'Selin Arman',
    title: 'I moved to Amsterdam after delaying it for 2 years',
    decision: 'Leave a stable design job in Istanbul and relocate abroad.',
    location: 'Amsterdam',
    timeline: '9 months after the move',
    outcome:
      'The first three months were expensive and emotionally rough, but my salary adjusted within half a year and I built a healthier routine with less burnout.',
    lesson:
      'I wish I had prepared a deeper cash buffer and talked to more people about loneliness, not just salaries and visas.',
    tags: ['relocation', 'career', 'design'],
    createdAt: '2026-01-08T08:00:00.000Z',
  },
  {
    id: 'seed-story-2',
    authorId: 'seed-user-2',
    authorName: 'Mert Kaya',
    title: 'Quitting consulting to build my own product was slower than expected',
    decision: 'Leave consulting and go full-time on a B2B SaaS idea.',
    location: 'Berlin',
    timeline: '14 months after quitting',
    outcome:
      'Revenue came later than planned, but the freedom and focus were real. I ended up building a narrower product than the one in my first pitch deck.',
    lesson:
      'The emotional drag comes from ambiguity, not just money. Weekly founder check-ins mattered more than another productivity system.',
    tags: ['startup', 'career', 'risk'],
    createdAt: '2026-02-12T14:20:00.000Z',
  },
]

const copy: Record<Language, Copy> = {
  en: {
    nav: {
      story: 'Story',
      how: 'How it works',
      useCases: 'Use cases',
      explore: 'Explore stories',
      auth: 'Login',
      dashboard: 'Dashboard',
    },
    hero: {
      badge: 'Decision intelligence for real life',
      title: 'See the',
      titleAccent: 'outcome',
      description:
        'Outcomee is now more than a landing page. People can sign up, log in, publish their own decision stories, and explore lived aftermaths in one bilingual product.',
      primary: 'Open live app',
      secondary: 'Explore stories',
      proof: ['Signup and login', 'Write and publish stories', 'Bilingual English and Turkish'],
    },
    spotlight: {
      label: 'What changed',
      title: 'Not just a concept page. A working product loop.',
      description:
        'Users can create an account, return later, publish a story, and see those stories rendered inside the product immediately.',
      cards: [
        {
          eyebrow: 'Account layer',
          text: 'Email and password based login/signup flow stored locally for a fully runnable MVP.',
        },
        {
          eyebrow: 'Story publishing',
          text: 'Every signed-in user can write a decision, the outcome, and the lesson learned.',
        },
        {
          eyebrow: 'Real feed',
          text: 'Published stories appear in the discovery feed and in the author dashboard without reload hacks.',
        },
      ],
    },
    steps: {
      eyebrow: 'How it works',
      title: 'A usable MVP flow from first visit to published story.',
      items: [
        {
          title: 'Create an account',
          text: 'A new member signs up with name, email, password, and a short bio.',
        },
        {
          title: 'Publish a real story',
          text: 'They describe the decision, the context, the outcome, and the lesson in a structured form.',
        },
        {
          title: 'Explore patterns',
          text: 'Every visitor can browse the feed to compare different paths and aftermaths.',
        },
      ],
    },
    reasons: {
      eyebrow: 'Why it matters',
      title: 'The product now has an actual interaction model.',
      items: [
        {
          title: 'Persistent local state',
          text: 'Accounts, sessions, and stories survive refresh by using browser storage.',
        },
        {
          title: 'Clear contribution path',
          text: 'People can see exactly where they log in and where they write their story.',
        },
        {
          title: 'Still branded and polished',
          text: 'The marketing layer remains intact while the core MVP flow is now usable.',
        },
      ],
    },
    useCases: {
      eyebrow: 'Where it helps',
      title: 'Outcomee fits high-stakes decisions with visible aftermath.',
      items: [
        {
          title: 'Career changes',
          text: 'Compare job switches, startup bets, and safer paths using lived reports.',
        },
        {
          title: 'Relocation and education',
          text: 'Study abroad, move city, or change discipline with more realistic expectations.',
        },
        {
          title: 'Major life commitments',
          text: 'Read what happened after the choice, not only what people predicted before it.',
        },
      ],
    },
    app: {
      liveBadge: 'Live stories',
      liveTitle: 'Explore published stories',
      liveDescription:
        'This feed is live inside the browser. Seeded examples are included so the product does not start empty, and new user stories appear instantly.',
      composerLocked: 'Log in to publish your own story.',
      composerReady: 'You are signed in. Your story can be published below.',
      emptyStories: 'No stories yet. Create the first one from the composer.',
      byLabel: 'By',
      timelineLabel: 'Timeline',
      outcomeLabel: 'Outcome',
      lessonLabel: 'Lesson',
      tagsLabel: 'Tags',
      seededNote: 'Demo accounts: selin@outcomee.app / demo123 and mert@outcomee.app / demo123',
    },
    auth: {
      eyebrow: 'Access',
      title: 'Create account or log back in',
      description:
        'This MVP includes a real in-browser account flow so users know where to sign in before contributing.',
      loginTab: 'Login',
      signupTab: 'Sign up',
      name: 'Full name',
      email: 'Email address',
      password: 'Password',
      bio: 'Short bio',
      loginButton: 'Login to Outcomee',
      signupButton: 'Create account',
      logoutButton: 'Log out',
      welcome: 'Welcome back',
      loggedInAs: 'Signed in as',
      loginSuccess: 'Login successful.',
      signupSuccess: 'Account created and signed in.',
      invalidLogin: 'Email or password is incorrect.',
      emailTaken: 'This email is already registered.',
      passwordRule: 'Password must be at least 6 characters.',
      requiredRule: 'Please fill in the required fields.',
    },
    composer: {
      eyebrow: 'Write a story',
      title: 'Publish what happened after the decision',
      description:
        'Structure the story so others can compare paths, timing, and trade-offs instead of reading vague advice.',
      titleLabel: 'Story title',
      decisionLabel: 'Decision you made',
      locationLabel: 'City or context',
      timelineLabel: 'Timeline after the decision',
      outcomeLabel: 'What happened after',
      lessonLabel: 'What you learned',
      tagsLabel: 'Tags (comma separated)',
      submitButton: 'Publish story',
      success: 'Story published to the live feed.',
      helper: 'Keep it concrete. Mention timing, risk, cost, and what changed.',
    },
    dashboard: {
      eyebrow: 'Your space',
      title: 'Member dashboard',
      description: 'Review your profile and the stories you have already published.',
      storyCount: 'Stories published',
      memberSince: 'Member since',
      noStories: 'You have not published a story yet.',
      delete: 'Delete',
    },
    footer: 'Outcomee. See the outcome before the choice.',
  },
  tr: {
    nav: {
      story: 'Hikaye',
      how: 'Nasıl çalışır',
      useCases: 'Kullanım alanları',
      explore: 'Hikayeleri keşfet',
      auth: 'Giriş',
      dashboard: 'Panel',
    },
    hero: {
      badge: 'Gerçek hayat için karar zekası',
      title: 'Karardan önce',
      titleAccent: 'sonucu gör',
      description:
        'Outcomee artık sadece bir landing page değil. İnsanlar kayıt olabiliyor, giriş yapabiliyor, kendi karar hikayelerini yayınlayabiliyor ve yaşanmış sonuçları aynı ürün içinde keşfedebiliyor.',
      primary: 'Canlı uygulamayı aç',
      secondary: 'Hikayeleri keşfet',
      proof: ['Kayıt ve giriş akışı', 'Hikaye yazma ve yayınlama', 'İngilizce ve Türkçe deneyim'],
    },
    spotlight: {
      label: 'Ne değişti',
      title: 'Sadece konsept sayfası değil. Çalışan ürün döngüsü.',
      description:
        'Kullanıcı hesap oluşturabiliyor, sonra geri dönebiliyor, hikaye yayınlayabiliyor ve o hikaye ürün içinde anında görünüyor.',
      cards: [
        {
          eyebrow: 'Hesap katmanı',
          text: 'Tam çalıştırılabilir bir MVP için e-posta ve şifre tabanlı giriş/kayıt akışı yerel olarak saklanıyor.',
        },
        {
          eyebrow: 'Hikaye yayınlama',
          text: 'Giriş yapan her kullanıcı kararını, sonucunu ve çıkardığı dersi yapılandırılmış biçimde yazabiliyor.',
        },
        {
          eyebrow: 'Gerçek akış',
          text: 'Yayınlanan hikayeler keşif akışında ve yazar panelinde yeniden yükleme hilesi olmadan görünüyor.',
        },
      ],
    },
    steps: {
      eyebrow: 'Nasıl çalışır',
      title: 'İlk ziyaretten yayınlanan hikayeye kadar kullanılabilir bir MVP akışı.',
      items: [
        {
          title: 'Hesap oluştur',
          text: 'Yeni üye ad, e-posta, şifre ve kısa biyografi ile kayıt olur.',
        },
        {
          title: 'Gerçek bir hikaye yayınla',
          text: 'Kararı, bağlamı, sonucu ve çıkarımı yapılandırılmış form ile paylaşır.',
        },
        {
          title: 'Örüntüleri incele',
          text: 'Her ziyaretçi farklı yolları ve sonuçları akış içinde gezebilir.',
        },
      ],
    },
    reasons: {
      eyebrow: 'Neden önemli',
      title: 'Ürünün artık gerçek bir etkileşim modeli var.',
      items: [
        {
          title: 'Kalıcı yerel durum',
          text: 'Hesaplar, oturumlar ve hikayeler tarayıcı depolamasıyla sayfa yenilense de korunur.',
        },
        {
          title: 'Net katkı akışı',
          text: 'İnsanlar nereye giriş yapacağını ve hikayesini nerede yazacağını açıkça görür.',
        },
        {
          title: 'Marka dili korunuyor',
          text: 'Pazarlama katmanı dururken ürünün temel MVP akışı gerçekten kullanılabilir hale geldi.',
        },
      ],
    },
    useCases: {
      eyebrow: 'Nerede işe yarar',
      title: 'Outcomee görünür sonrası olan yüksek etkili kararlar için uygun.',
      items: [
        {
          title: 'Kariyer değişimleri',
          text: 'İş değişimi, girişim denemesi ve güvenli yolları yaşanmış raporlarla kıyasla.',
        },
        {
          title: 'Taşınma ve eğitim',
          text: 'Yurtdışı, şehir değişimi veya bölüm değişimini daha gerçekçi beklentilerle değerlendir.',
        },
        {
          title: 'Büyük hayat kararları',
          text: 'Karardan sonra ne olduğunu oku; sadece önceden yapılan tahminleri değil.',
        },
      ],
    },
    app: {
      liveBadge: 'Canlı hikayeler',
      liveTitle: 'Yayınlanan hikayeleri keşfet',
      liveDescription:
        'Bu akış tarayıcı içinde canlı çalışır. Ürün boş başlamasın diye örnek hikayeler vardır ve yeni kullanıcı hikayeleri anında görünür.',
      composerLocked: 'Kendi hikayeni yayınlamak için giriş yap.',
      composerReady: 'Giriş yaptın. Hikayen aşağıdan yayınlanabilir.',
      emptyStories: 'Henüz hikaye yok. İlk hikayeyi editörden oluştur.',
      byLabel: 'Yazar',
      timelineLabel: 'Zaman',
      outcomeLabel: 'Sonuç',
      lessonLabel: 'Ders',
      tagsLabel: 'Etiketler',
      seededNote: 'Demo hesaplar: selin@outcomee.app / demo123 ve mert@outcomee.app / demo123',
    },
    auth: {
      eyebrow: 'Erişim',
      title: 'Hesap oluştur veya yeniden giriş yap',
      description:
        'Bu MVP, kullanıcıların katkıdan önce nereye giriş yapacağını görmesi için gerçek bir tarayıcı içi hesap akışı içerir.',
      loginTab: 'Giriş yap',
      signupTab: 'Kayıt ol',
      name: 'Ad soyad',
      email: 'E-posta adresi',
      password: 'Şifre',
      bio: 'Kısa biyografi',
      loginButton: 'Outcomee giriş',
      signupButton: 'Hesap oluştur',
      logoutButton: 'Çıkış yap',
      welcome: 'Tekrar hoş geldin',
      loggedInAs: 'Giriş yapan',
      loginSuccess: 'Giriş başarılı.',
      signupSuccess: 'Hesap oluşturuldu ve giriş yapıldı.',
      invalidLogin: 'E-posta veya şifre hatalı.',
      emailTaken: 'Bu e-posta zaten kayıtlı.',
      passwordRule: 'Şifre en az 6 karakter olmalı.',
      requiredRule: 'Gerekli alanları doldur.',
    },
    composer: {
      eyebrow: 'Hikaye yaz',
      title: 'Karardan sonra ne olduğunu yayınla',
      description:
        'Başkaları belirsiz tavsiyeler yerine yol, zaman ve bedelleri karşılaştırabilsin diye hikayeyi yapılandır.',
      titleLabel: 'Hikaye başlığı',
      decisionLabel: 'Verdiğin karar',
      locationLabel: 'Şehir veya bağlam',
      timelineLabel: 'Karardan sonra geçen süre',
      outcomeLabel: 'Sonrasında ne oldu',
      lessonLabel: 'Ne öğrendin',
      tagsLabel: 'Etiketler (virgülle ayır)',
      submitButton: 'Hikayeyi yayınla',
      success: 'Hikaye canlı akışa eklendi.',
      helper: 'Somut yaz. Zamanı, riski, maliyeti ve değişeni belirt.',
    },
    dashboard: {
      eyebrow: 'Sana ait alan',
      title: 'Üye paneli',
      description: 'Profilini ve daha önce yayınladığın hikayeleri gözden geçir.',
      storyCount: 'Yayınlanan hikaye',
      memberSince: 'Katılım tarihi',
      noStories: 'Henüz bir hikaye yayınlamadın.',
      delete: 'Sil',
    },
    footer: 'Outcomee. Karardan önce sonucu gör.',
  },
}

const formatDate = (dateValue: string, language: Language) =>
  new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateValue))

const parseStored = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback
  }

  const raw = window.localStorage.getItem(key)
  if (!raw) {
    return fallback
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function App() {
  const [language, setLanguage] = useState<Language>('tr')
  const [authMode, setAuthMode] = useState<AuthMode>('signup')
  const [isHydrated, setIsHydrated] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [authMessage, setAuthMessage] = useState('')
  const [storyMessage, setStoryMessage] = useState('')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', bio: '' })
  const [storyForm, setStoryForm] = useState({
    title: '',
    decision: '',
    location: '',
    timeline: '',
    outcome: '',
    lesson: '',
    tags: '',
  })

  const content = copy[language]

  useEffect(() => {
    const storedUsers = parseStored<User[]>(USERS_KEY, seededUsers)
    const storedStories = parseStored<Story[]>(STORIES_KEY, seededStories)
    const storedSession = parseStored<string | null>(SESSION_KEY, null)
    setUsers(storedUsers)
    setStories(storedStories)
    setCurrentUserId(storedSession)
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    document.title = 'Outcomee'
  }, [language])

  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated) {
      return
    }
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }, [isHydrated, users])

  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated) {
      return
    }
    window.localStorage.setItem(STORIES_KEY, JSON.stringify(stories))
  }, [isHydrated, stories])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    if (currentUserId) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(currentUserId))
      return
    }
    window.localStorage.removeItem(SESSION_KEY)
  }, [currentUserId])

  const currentUser = useMemo(
    () => users.find((user) => user.id === currentUserId) ?? null,
    [currentUserId, users],
  )

  const visibleStories = useMemo(
    () => [...stories].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    [stories],
  )

  const myStories = useMemo(
    () => visibleStories.filter((story) => story.authorId === currentUserId),
    [currentUserId, visibleStories],
  )

  const resetAuthForm = () => {
    setAuthForm({ name: '', email: '', password: '', bio: '' })
  }

  const handleAuthSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthMessage('')

    const email = authForm.email.trim().toLowerCase()
    const password = authForm.password.trim()
    const name = authForm.name.trim()
    const bio = authForm.bio.trim()

    if (!email || !password || (authMode === 'signup' && !name)) {
      setAuthMessage(content.auth.requiredRule)
      return
    }

    if (password.length < 6) {
      setAuthMessage(content.auth.passwordRule)
      return
    }

    if (authMode === 'signup') {
      const emailExists = users.some((user) => user.email.toLowerCase() === email)
      if (emailExists) {
        setAuthMessage(content.auth.emailTaken)
        return
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
        bio,
        createdAt: new Date().toISOString(),
      }

      setUsers((previous) => [...previous, newUser])
      setCurrentUserId(newUser.id)
      setAuthMessage(content.auth.signupSuccess)
      setAuthMode('login')
      resetAuthForm()
      return
    }

    const matchedUser = users.find(
      (user) => user.email.toLowerCase() === email && user.password === password,
    )

    if (!matchedUser) {
      setAuthMessage(content.auth.invalidLogin)
      return
    }

    setCurrentUserId(matchedUser.id)
    setAuthMessage(content.auth.loginSuccess)
    resetAuthForm()
  }

  const handleStorySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStoryMessage('')

    if (!currentUser) {
      setStoryMessage(content.app.composerLocked)
      return
    }

    const requiredValues = Object.values(storyForm).map((value) => value.trim())
    if (requiredValues.some((value) => !value)) {
      setStoryMessage(content.auth.requiredRule)
      return
    }

    const newStory: Story = {
      id: crypto.randomUUID(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      title: storyForm.title.trim(),
      decision: storyForm.decision.trim(),
      location: storyForm.location.trim(),
      timeline: storyForm.timeline.trim(),
      outcome: storyForm.outcome.trim(),
      lesson: storyForm.lesson.trim(),
      tags: storyForm.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
    }

    setStories((previous) => [newStory, ...previous])
    setStoryForm({
      title: '',
      decision: '',
      location: '',
      timeline: '',
      outcome: '',
      lesson: '',
      tags: '',
    })
    setStoryMessage(content.composer.success)
  }

  const handleDeleteStory = (storyId: string) => {
    setStories((previous) => previous.filter((story) => story.id !== storyId))
  }

  const handleLogout = () => {
    setCurrentUserId(null)
    setAuthMessage('')
    setStoryMessage('')
  }

  return (
    <div className="page-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <header className="topbar">
        <a className="brand" href="#hero" aria-label="Outcomee home">
          <span className="brand-mark">O</span>
          <span className="brand-text">Outcomee</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          <a href="#story">{content.nav.story}</a>
          <a href="#how">{content.nav.how}</a>
          <a href="#use-cases">{content.nav.useCases}</a>
          <a href="#explore">{content.nav.explore}</a>
          <a href={currentUser ? '#dashboard' : '#auth'}>
            {currentUser ? content.nav.dashboard : content.nav.auth}
          </a>
        </nav>

        <div className="topbar-actions">
          {currentUser ? (
            <div className="session-pill">
              <span>{currentUser.name}</span>
              <button className="session-button" onClick={handleLogout} type="button">
                {content.auth.logoutButton}
              </button>
            </div>
          ) : null}

          <div className="lang-switch" aria-label="Language switcher">
            <button
              className={language === 'en' ? 'lang-button active' : 'lang-button'}
              onClick={() => setLanguage('en')}
              type="button"
            >
              EN
            </button>
            <button
              className={language === 'tr' ? 'lang-button active' : 'lang-button'}
              onClick={() => setLanguage('tr')}
              type="button"
            >
              TR
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="hero">
          <div className="hero-copy">
            <p className="eyebrow">{content.hero.badge}</p>
            <h1>
              {content.hero.title} <span>{content.hero.titleAccent}</span>
            </h1>
            <p className="hero-description">{content.hero.description}</p>

            <div className="hero-actions">
              <a className="button-primary" href={currentUser ? '#dashboard' : '#auth'}>
                {content.hero.primary}
              </a>
              <a className="button-secondary" href="#explore">
                {content.hero.secondary}
              </a>
            </div>

            <div className="proof-strip">
              {content.hero.proof.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <aside className="hero-panel">
            <div className="panel-orbit" />
            <p className="panel-label">Outcomee OS</p>
            <div className="metric-card">
              <span>01</span>
              <strong>{language === 'en' ? 'Account active' : 'Hesap aktif'}</strong>
              <p>
                {currentUser
                  ? `${content.auth.loggedInAs} ${currentUser.email}`
                  : language === 'en'
                    ? 'Users can sign up or log in from the access section below.'
                    : 'Kullanıcılar aşağıdaki erişim bölümünden kayıt olabilir veya giriş yapabilir.'}
              </p>
            </div>
            <div className="metric-card accent">
              <span>02</span>
              <strong>{language === 'en' ? 'Stories live' : 'Hikayeler canlı'}</strong>
              <p>
                {visibleStories.length}{' '}
                {language === 'en' ? 'published stories in the feed.' : 'yayınlanmış hikaye akışta görünüyor.'}
              </p>
            </div>
            <p className="seeded-note">{content.app.seededNote}</p>
          </aside>
        </section>

        <section className="section spotlight" id="story">
          <div className="section-heading">
            <p className="eyebrow">{content.spotlight.label}</p>
            <h2>{content.spotlight.title}</h2>
            <p>{content.spotlight.description}</p>
          </div>
          <div className="spotlight-grid">
            {content.spotlight.cards.map((card) => (
              <article className="glass-card" key={card.eyebrow}>
                <p className="card-eyebrow">{card.eyebrow}</p>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section steps" id="how">
          <div className="section-heading compact">
            <p className="eyebrow">{content.steps.eyebrow}</p>
            <h2>{content.steps.title}</h2>
          </div>
          <div className="steps-grid">
            {content.steps.items.map((item, index) => (
              <article className="step-card" key={item.title}>
                <div className="step-number">0{index + 1}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section reasons">
          <div className="section-heading compact">
            <p className="eyebrow">{content.reasons.eyebrow}</p>
            <h2>{content.reasons.title}</h2>
          </div>
          <div className="reasons-grid">
            {content.reasons.items.map((item) => (
              <article className="feature-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section use-cases" id="use-cases">
          <div className="section-heading">
            <p className="eyebrow">{content.useCases.eyebrow}</p>
            <h2>{content.useCases.title}</h2>
          </div>
          <div className="use-case-list">
            {content.useCases.items.map((item) => (
              <article className="use-case-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section live-section" id="explore">
          <div className="section-heading live-heading">
            <div>
              <p className="eyebrow">{content.app.liveBadge}</p>
              <h2>{content.app.liveTitle}</h2>
            </div>
            <p>{content.app.liveDescription}</p>
          </div>

          <div className="live-grid">
            <section className="auth-panel" id="auth">
              <div className="panel-stack-header">
                <p className="eyebrow">{content.auth.eyebrow}</p>
                <h3>{content.auth.title}</h3>
                <p>{content.auth.description}</p>
              </div>

              {currentUser ? (
                <div className="signed-in-card">
                  <p className="auth-status-title">
                    {content.auth.welcome}, {currentUser.name}
                  </p>
                  <p className="auth-status-copy">
                    {content.auth.loggedInAs} {currentUser.email}
                  </p>
                  <p className="auth-status-copy">{currentUser.bio || currentUser.name}</p>
                  <a className="button-primary full-width" href="#composer">
                    {content.composer.submitButton}
                  </a>
                </div>
              ) : (
                <>
                  <div className="tab-switch" role="tablist" aria-label="Auth mode switcher">
                    <button
                      className={authMode === 'login' ? 'tab-button active' : 'tab-button'}
                      onClick={() => {
                        setAuthMode('login')
                        setAuthMessage('')
                      }}
                      type="button"
                    >
                      {content.auth.loginTab}
                    </button>
                    <button
                      className={authMode === 'signup' ? 'tab-button active' : 'tab-button'}
                      onClick={() => {
                        setAuthMode('signup')
                        setAuthMessage('')
                      }}
                      type="button"
                    >
                      {content.auth.signupTab}
                    </button>
                  </div>

                  <form className="panel-form" onSubmit={handleAuthSubmit}>
                    {authMode === 'signup' ? (
                      <label>
                        <span>{content.auth.name}</span>
                        <input
                          onChange={(event) =>
                            setAuthForm((previous) => ({ ...previous, name: event.target.value }))
                          }
                          type="text"
                          value={authForm.name}
                        />
                      </label>
                    ) : null}

                    <label>
                      <span>{content.auth.email}</span>
                      <input
                        onChange={(event) =>
                          setAuthForm((previous) => ({ ...previous, email: event.target.value }))
                        }
                        placeholder="name@example.com"
                        type="email"
                        value={authForm.email}
                      />
                    </label>

                    <label>
                      <span>{content.auth.password}</span>
                      <input
                        onChange={(event) =>
                          setAuthForm((previous) => ({ ...previous, password: event.target.value }))
                        }
                        type="password"
                        value={authForm.password}
                      />
                    </label>

                    {authMode === 'signup' ? (
                      <label>
                        <span>{content.auth.bio}</span>
                        <textarea
                          onChange={(event) =>
                            setAuthForm((previous) => ({ ...previous, bio: event.target.value }))
                          }
                          rows={4}
                          value={authForm.bio}
                        />
                      </label>
                    ) : null}

                    <button className="button-primary full-width" type="submit">
                      {authMode === 'login' ? content.auth.loginButton : content.auth.signupButton}
                    </button>

                    <p className={authMessage ? 'form-feedback visible' : 'form-feedback'}>
                      {authMessage || ' '}
                    </p>
                  </form>
                </>
              )}
            </section>

            <section className="story-feed-panel">
              <div className="panel-stack-header">
                <p className="eyebrow">{content.app.liveBadge}</p>
                <h3>{content.app.liveTitle}</h3>
                <p>{currentUser ? content.app.composerReady : content.app.composerLocked}</p>
              </div>

              <div className="story-feed">
                {visibleStories.length === 0 ? (
                  <article className="story-card empty-state">{content.app.emptyStories}</article>
                ) : (
                  visibleStories.map((story) => (
                    <article className="story-card" key={story.id}>
                      <div className="story-card-top">
                        <div>
                          <p className="story-meta">
                            {content.app.byLabel} {story.authorName}
                          </p>
                          <h4>{story.title}</h4>
                        </div>
                        <span className="story-date">{formatDate(story.createdAt, language)}</span>
                      </div>

                      <div className="story-detail-grid">
                        <div>
                          <p className="story-label">{content.composer.decisionLabel}</p>
                          <p>{story.decision}</p>
                        </div>
                        <div>
                          <p className="story-label">{content.composer.locationLabel}</p>
                          <p>{story.location}</p>
                        </div>
                        <div>
                          <p className="story-label">{content.app.timelineLabel}</p>
                          <p>{story.timeline}</p>
                        </div>
                      </div>

                      <p className="story-label">{content.app.outcomeLabel}</p>
                      <p>{story.outcome}</p>

                      <p className="story-label">{content.app.lessonLabel}</p>
                      <p>{story.lesson}</p>

                      <div className="tag-row">
                        <span className="tag-row-label">{content.app.tagsLabel}</span>
                        {story.tags.map((tag) => (
                          <span className="story-tag" key={`${story.id}-${tag}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        </section>

        <section className="section workspace-grid" id="dashboard">
          <section className="composer-panel" id="composer">
            <div className="panel-stack-header">
              <p className="eyebrow">{content.composer.eyebrow}</p>
              <h3>{content.composer.title}</h3>
              <p>{content.composer.description}</p>
            </div>

            <form className="panel-form" onSubmit={handleStorySubmit}>
              <label>
                <span>{content.composer.titleLabel}</span>
                <input
                  onChange={(event) =>
                    setStoryForm((previous) => ({ ...previous, title: event.target.value }))
                  }
                  type="text"
                  value={storyForm.title}
                />
              </label>

              <label>
                <span>{content.composer.decisionLabel}</span>
                <textarea
                  onChange={(event) =>
                    setStoryForm((previous) => ({ ...previous, decision: event.target.value }))
                  }
                  rows={3}
                  value={storyForm.decision}
                />
              </label>

              <div className="split-fields">
                <label>
                  <span>{content.composer.locationLabel}</span>
                  <input
                    onChange={(event) =>
                      setStoryForm((previous) => ({ ...previous, location: event.target.value }))
                    }
                    type="text"
                    value={storyForm.location}
                  />
                </label>
                <label>
                  <span>{content.composer.timelineLabel}</span>
                  <input
                    onChange={(event) =>
                      setStoryForm((previous) => ({ ...previous, timeline: event.target.value }))
                    }
                    type="text"
                    value={storyForm.timeline}
                  />
                </label>
              </div>

              <label>
                <span>{content.composer.outcomeLabel}</span>
                <textarea
                  onChange={(event) =>
                    setStoryForm((previous) => ({ ...previous, outcome: event.target.value }))
                  }
                  rows={5}
                  value={storyForm.outcome}
                />
              </label>

              <label>
                <span>{content.composer.lessonLabel}</span>
                <textarea
                  onChange={(event) =>
                    setStoryForm((previous) => ({ ...previous, lesson: event.target.value }))
                  }
                  rows={4}
                  value={storyForm.lesson}
                />
              </label>

              <label>
                <span>{content.composer.tagsLabel}</span>
                <input
                  onChange={(event) =>
                    setStoryForm((previous) => ({ ...previous, tags: event.target.value }))
                  }
                  placeholder={language === 'en' ? 'career, relocation, startup' : 'kariyer, taşınma, girişim'}
                  type="text"
                  value={storyForm.tags}
                />
              </label>

              <button className="button-primary full-width" type="submit">
                {content.composer.submitButton}
              </button>

              <p className={storyMessage ? 'form-feedback visible' : 'form-feedback'}>
                {storyMessage || ' '}
              </p>
              <p className="form-note">{content.composer.helper}</p>
            </form>
          </section>

          <section className="dashboard-panel">
            <div className="panel-stack-header">
              <p className="eyebrow">{content.dashboard.eyebrow}</p>
              <h3>{content.dashboard.title}</h3>
              <p>{content.dashboard.description}</p>
            </div>

            {currentUser ? (
              <>
                <div className="dashboard-metrics">
                  <article className="dashboard-metric-card">
                    <span>{myStories.length}</span>
                    <p>{content.dashboard.storyCount}</p>
                  </article>
                  <article className="dashboard-metric-card">
                    <span>{formatDate(currentUser.createdAt, language)}</span>
                    <p>{content.dashboard.memberSince}</p>
                  </article>
                </div>

                <div className="profile-card">
                  <strong>{currentUser.name}</strong>
                  <p>{currentUser.email}</p>
                  <p>{currentUser.bio || '-'}</p>
                </div>

                <div className="my-story-list">
                  {myStories.length === 0 ? (
                    <article className="story-card empty-state">{content.dashboard.noStories}</article>
                  ) : (
                    myStories.map((story) => (
                      <article className="story-card compact" key={story.id}>
                        <div className="story-card-top">
                          <div>
                            <h4>{story.title}</h4>
                            <p className="story-meta">{formatDate(story.createdAt, language)}</p>
                          </div>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteStory(story.id)}
                            type="button"
                          >
                            {content.dashboard.delete}
                          </button>
                        </div>
                        <p>{story.outcome}</p>
                      </article>
                    ))
                  )}
                </div>
              </>
            ) : (
              <article className="story-card empty-state">{content.app.composerLocked}</article>
            )}
          </section>
        </section>
      </main>

      <footer className="footer">{content.footer}</footer>
    </div>
  )
}

export default App