import { useState, useEffect } from 'react'
import Head from 'next/head'
import { supabase } from '../lib/supabase'

// Team members (for deal assignment)
const TEAM_MEMBERS = [
  { id: 'unassigned', name: 'Unassigned', color: 'text-slate-500', bgColor: 'bg-slate-100', icon: '👥' },
  { id: 'edwin', name: 'Edwin', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: '👔' },
  { id: 'elizabeth', name: 'Elizabeth', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: '👩‍�' },
  { id: 'siraaj', name: 'Siraaj', color: 'text-green-700', bgColor: 'bg-green-100', icon: '👨‍💼' },
]

// Deal stages in order
const STAGES = [
  { 
    id: 'new-opportunity', 
    name: 'New Opportunity', 
    color: 'bg-slate-600', 
    description: 'Initial inquiries from vendors',
    requiresVision: false,
    allowedNextStages: ['credit-pending', 'declined']
  },
  { 
    id: 'credit-pending', 
    name: 'Credit Pending', 
    color: 'bg-amber-500', 
    description: 'Submitted to credit team - Vision # assigned here',
    requiresVision: false,
    allowedNextStages: ['approved', 'conditional', 'declined']
  },
  { 
    id: 'approved', 
    name: 'Approved', 
    color: 'bg-emerald-600', 
    description: 'Credit approved',
    requiresVision: true,
    allowedNextStages: ['preparing-docs']
  },
  { 
    id: 'conditional', 
    name: 'Conditional', 
    color: 'bg-orange-500', 
    description: 'Approved with conditions',
    requiresVision: true,
    allowedNextStages: ['approved', 'preparing-docs', 'declined']
  },
  { 
    id: 'declined', 
    name: 'Declined', 
    color: 'bg-red-600', 
    description: 'Credit declined',
    requiresVision: false,
    allowedNextStages: []
  },
  { 
    id: 'preparing-docs', 
    name: 'Preparing Docs', 
    color: 'bg-violet-600', 
    description: 'Creating lease documents',
    requiresVision: true,
    allowedNextStages: ['pending-signatures']
  },
  { 
    id: 'pending-signatures', 
    name: 'Pending Docs', 
    color: 'bg-pink-600', 
    description: 'Waiting for signatures & DL',
    requiresVision: true,
    allowedNextStages: ['audit-v1']
  },
  { 
    id: 'audit-v1', 
    name: 'Audit V1', 
    color: 'bg-blue-600', 
    description: 'First audit review',
    requiresVision: true,
    allowedNextStages: ['audit-v2', 'audit-corrections']
  },
  { 
    id: 'audit-corrections', 
    name: 'Corrections', 
    color: 'bg-yellow-600', 
    description: 'Fixing audit issues',
    requiresVision: true,
    allowedNextStages: ['audit-v1']
  },
  { 
    id: 'audit-v2', 
    name: 'Audit V2', 
    color: 'bg-cyan-600', 
    description: 'Final audit review',
    requiresVision: true,
    allowedNextStages: ['funded', 'audit-corrections']
  },
    { 
    id: 'post-funding-requirements', 
    name: 'Post Funding', 
    color: 'bg-indigo-600', 
    description: 'Additional requirements after funding',
    requiresVision: true,
    allowedNextStages: ['funded']
  },
  ,
  { 
    id: 'funded', 
    name: 'Funded ✓', 
    color: 'bg-green-700', 
    description: 'Deal complete!',
    requiresVision: true,
    allowedNextStages: []
  },
]

export default function Deals() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [viewingBoard, setViewingBoard] = useState(null)
  const [deals, setDeals] = useState([])
  const [draggedDeal, setDraggedDeal] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchField, setSearchField] = useState('all')
  const [searchMode, setSearchMode] = useState('contains')
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [validationError, setValidationError] = useState(null)
  const [savedVendors, setSavedVendors] = useState([])
  const [savedClients, setSavedClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Determine which board to show
  const activeBoardId = (profile?.role === 'associate' || profile?.role === 'director') ? viewingBoard : profile?.board_id

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          setUser(session.user)
          await fetchUserProfile(session.user.id)
        } else {
          setShowLoginModal(true)
        }
      } catch (error) {
        console.error('Error checking user:', error)
        setShowLoginModal(true)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await fetchUserProfile(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
        setViewingBoard(null)
        setShowLoginModal(true)
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      setProfile(data)
      
      // If associate or director, set default viewing board
      if (data.role === 'associate' || data.role === 'director') {
        const savedBoard = localStorage.getItem('mhcca-viewing-board')
        setViewingBoard(savedBoard || 'edwin')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  // Load deals from database
  useEffect(() => {
    if (!activeBoardId) return

    const loadData = async () => {
      try {
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .eq('board_id', activeBoardId)
          .order('created_at', { ascending: false })

        if (error) throw error

        // Convert timestamps to Date objects
        const dealsWithDates = data.map(deal => ({
          ...deal,
          createdAt: new Date(deal.created_at),
          updatedAt: new Date(deal.updated_at),
          visionNumber: deal.vision_number,
          assignedTo: deal.assigned_to,
          folderLink: deal.folder_link,
        }))

        setDeals(dealsWithDates)
      } catch (error) {
        console.error('Error loading deals:', error)
      }

      // Load vendors and clients
      try {
        const [vendorsResult, clientsResult] = await Promise.all([
          supabase.from('vendors').select('name').order('name'),
          supabase.from('clients').select('name').order('name')
        ])

        if (vendorsResult.data) {
          setSavedVendors(vendorsResult.data.map(v => v.name))
        }
        if (clientsResult.data) {
          setSavedClients(clientsResult.data.map(c => c.name))
        }
      } catch (error) {
        console.error('Error loading vendors/clients:', error)
      }
    }

    loadData()
  }, [activeBoardId])

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (error) throw error

      setUser(data.user)
      await fetchUserProfile(data.user.id)
      setShowLoginModal(false)
      setLoginEmail('')
      setLoginPassword('')
    } catch (error) {
      console.error('Login error:', error)
      setLoginError(error.message || 'Invalid email or password')
    }
  }

  // Handle board switching (associates only)
  const handleSwitchBoard = (boardId) => {
    setViewingBoard(boardId)
    localStorage.setItem('mhcca-viewing-board', boardId)
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem('mhcca-viewing-board')
      setUser(null)
      setProfile(null)
      setViewingBoard(null)
      setDeals([])
      setShowLoginModal(true)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleDragStart = (deal) => {
    setDraggedDeal(deal)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (stageId) => {
    if (draggedDeal) {
      const targetStage = STAGES.find(s => s.id === stageId)
      
      // Validate Vision Number requirement
      if (targetStage.requiresVision && !draggedDeal.visionNumber) {
        setValidationError({
          title: 'Vision Number Required',
          message: `You must add a Vision Application Number before moving to "${targetStage.name}". Please edit the deal and add the Vision Number.`,
          dealId: draggedDeal.id
        })
        setDraggedDeal(null)
        return
      }

      updateDealStage(draggedDeal.id, stageId)
      setDraggedDeal(null)
    }
  }

  const updateDealStage = async (dealId, newStage) => {
    try {
      const { error } = await supabase
        .from('deals')
        .update({ 
          stage: newStage,
          updated_at: new Date().toISOString()
        })
        .eq('id', dealId)

      if (error) throw error

      // Update local state
      setDeals(deals.map(deal => 
        deal.id === dealId 
          ? { ...deal, stage: newStage, updatedAt: new Date() }
          : deal
      ))
    } catch (error) {
      console.error('Error updating deal stage:', error)
      alert('Failed to update deal. Please try again.')
    }
  }

  const addDeal = async (newDeal) => {
    try {
      // Add vendor if new
      if (newDeal.vendor && !savedVendors.includes(newDeal.vendor)) {
        await supabase.from('vendors').insert({ name: newDeal.vendor })
        setSavedVendors([...savedVendors, newDeal.vendor].sort())
      }

      // Add client if new
      if (newDeal.client && !savedClients.includes(newDeal.client)) {
        await supabase.from('clients').insert({ name: newDeal.client })
        setSavedClients([...savedClients, newDeal.client].sort())
      }

      // Insert deal
      const { data, error } = await supabase
        .from('deals')
        .insert({
          board_id: activeBoardId,
          vision_number: newDeal.visionNumber || null,
          vendor: newDeal.vendor,
          client: newDeal.client,
          stage: 'new-opportunity',
          assigned_to: newDeal.assignedTo || 'unassigned',
          notes: newDeal.notes || '',
          folder_link: newDeal.folderLink || null,
          created_by: user.id
        })
        .select()
        .single()

      if (error) throw error

      // Add to local state
      const dealWithDates = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        visionNumber: data.vision_number,
        assignedTo: data.assigned_to,
        folderLink: data.folder_link,
      }

      setDeals([dealWithDates, ...deals])
      setShowAddModal(false)
    } catch (error) {
      console.error('Error adding deal:', error)
      alert('Failed to add deal. Please try again.')
    }
  }

  const updateDeal = async (updatedDeal) => {
    try {
      // Add vendor if new
      if (updatedDeal.vendor && !savedVendors.includes(updatedDeal.vendor)) {
        await supabase.from('vendors').insert({ name: updatedDeal.vendor })
        setSavedVendors([...savedVendors, updatedDeal.vendor].sort())
      }

      // Add client if new
      if (updatedDeal.client && !savedClients.includes(updatedDeal.client)) {
        await supabase.from('clients').insert({ name: updatedDeal.client })
        setSavedClients([...savedClients, updatedDeal.client].sort())
      }

      // Update deal
      const { error } = await supabase
        .from('deals')
        .update({
          vision_number: updatedDeal.visionNumber || null,
          vendor: updatedDeal.vendor,
          client: updatedDeal.client,
          stage: updatedDeal.stage,
          assigned_to: updatedDeal.assignedTo,
          notes: updatedDeal.notes || '',
          folder_link: updatedDeal.folderLink || null,
        })
        .eq('id', updatedDeal.id)

      if (error) throw error

      // Update local state
      setDeals(deals.map(deal => 
        deal.id === updatedDeal.id 
          ? { ...updatedDeal, updatedAt: new Date() }
          : deal
      ))

      setShowEditModal(false)
      setSelectedDeal(null)
    } catch (error) {
      console.error('Error updating deal:', error)
      alert('Failed to update deal. Please try again.')
    }
  }

  const deleteDeal = async (dealId) => {
    if (!confirm('Are you sure you want to delete this deal?')) return

    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId)

      if (error) throw error

      setDeals(deals.filter(deal => deal.id !== dealId))
      setShowEditModal(false)
      setSelectedDeal(null)
    } catch (error) {
      console.error('Error deleting deal:', error)
      alert('Failed to delete deal. Please try again.')
    }
  }

  const getDealsForStage = (stageId) => {
    return deals.filter(deal => {
      const matchesStage = deal.stage === stageId
      
      // Enhanced search logic
      let matchesSearch = true
      if (searchTerm !== '') {
        const searchLower = searchTerm.toLowerCase()
        
        const checkMatch = (value) => {
          if (!value) return false
          const valueLower = value.toLowerCase()
          
          if (searchMode === 'exact') {
            return valueLower === searchLower
          } else if (searchMode === 'starts-with') {
            return valueLower.startsWith(searchLower)
          } else { // contains
            return valueLower.includes(searchLower)
          }
        }
        
        if (searchField === 'all') {
          matchesSearch = 
            checkMatch(deal.visionNumber) ||
            checkMatch(deal.vendor) ||
            checkMatch(deal.client) ||
            checkMatch(deal.notes)
        } else if (searchField === 'vision') {
          matchesSearch = checkMatch(deal.visionNumber)
        } else if (searchField === 'vendor') {
          matchesSearch = checkMatch(deal.vendor)
        } else if (searchField === 'client') {
          matchesSearch = checkMatch(deal.client)
        } else if (searchField === 'notes') {
          matchesSearch = checkMatch(deal.notes)
        }
      }
      
      const matchesAssignee = filterAssignee === 'all' || deal.assignedTo === filterAssignee
      return matchesStage && matchesSearch && matchesAssignee
    })
  }

  const getAssigneeName = (assigneeId) => {
    return TEAM_MEMBERS.find(m => m.id === assigneeId)?.name || 'Unassigned'
  }

  const getAssigneeInfo = (assigneeId) => {
    return TEAM_MEMBERS.find(m => m.id === assigneeId) || TEAM_MEMBERS[0]
  }

  return (
    <>
      <Head>
        <title>Deal Board - MHCCA</title>
        <meta name="description" content="Corporate leasing deal management board" />
      </Head>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center z-50">
          <div className="text-white text-2xl font-bold">Loading...</div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && !loading && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-4 rounded-full">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">MHCCA Deal Board</h2>
              <p className="text-blue-100">Sign in to continue</p>
            </div>
            
            <form onSubmit={handleLogin} className="p-8 space-y-6">
              {loginError && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{loginError}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none"
                  placeholder="your.email@mhccna.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </button>

              <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                <p>Contact your administrator if you need access</p>
              </div>
            </form>
          </div>
        </div>
      )}

      {!showLoginModal && !loading && profile && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          {/* Top Header Bar */}
          <div className="bg-white dark:bg-slate-950 shadow-md sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-6">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                      MHCCA Deal Board
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      {activeBoardId === 'edwin' ? "Edwin's Pipeline" : "Elizabeth's Pipeline"}
                    </p>
                  </div>
                  
                  {/* Board Switcher (Associates & Directors) */}
                  {(profile.role === 'associate' || profile.role === 'director') && (
                    <div className="flex items-center gap-3 ml-4 pl-4 border-l-2 border-slate-300 dark:border-slate-700">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Viewing Board:
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSwitchBoard('edwin')}
                          className={`px-4 py-2 rounded-lg font-bold transition-all ${
                            viewingBoard === 'edwin'
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                          }`}
                        >
                          👔 Edwin
                        </button>
                        <button
                          onClick={() => handleSwitchBoard('elizabeth')}
                          className={`px-4 py-2 rounded-lg font-bold transition-all ${
                            viewingBoard === 'elizabeth'
                              ? 'bg-purple-600 text-white shadow-lg'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                          }`}
                        >
                          👩‍💼 Elizabeth
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Current User Badge */}
                  <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg">
                    <span className="text-2xl">
                      {profile.role === 'associate' 
                        ? '👤' 
                        : profile.role === 'director'
                        ? '👨‍💼'
                        : profile.board_id === 'edwin' 
                        ? '👔' 
                        : '👩‍💼'}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {profile.full_name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {profile.role === 'associate' 
                          ? 'Associate' 
                          : profile.role === 'director'
                          ? 'Director'
                          : 'Account Manager'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold py-2 px-4 rounded-lg transition-all"
                  >
                    Logout
                  </button>
                  
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg flex items-center gap-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Deal
                  </button>
                </div>
              </div>

              {/* Search and Stats Bar */}
              <div className="flex items-center gap-4">
              <div className="flex-1 flex gap-2">
                {/* Search Field Selector */}
                <select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  className="px-3 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none text-sm font-medium min-w-[140px]"
                >
                  <option value="all">All Fields</option>
                  <option value="vision">Vision #</option>
                  <option value="vendor">Vendor</option>
                  <option value="client">Client</option>
                  <option value="notes">Notes</option>
                </select>

                {/* Search Mode Selector */}
                <select
                  value={searchMode}
                  onChange={(e) => setSearchMode(e.target.value)}
                  className="px-3 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none text-sm font-medium min-w-[140px]"
                >
                  <option value="contains">Contains</option>
                  <option value="exact">Exact Match</option>
                  <option value="starts-with">Starts With</option>
                </select>

                {/* Search Input */}
                <div className="flex-1 relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={`Search ${searchField === 'all' ? 'all fields' : searchField}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none text-base"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Filter by Assignee */}
              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none text-base font-medium"
              >
                <option value="all">All Team Members</option>
                {TEAM_MEMBERS.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.icon} {member.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-6 bg-slate-100 dark:bg-slate-900 px-6 py-3 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{deals.length}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Total Deals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {deals.filter(d => d.stage === 'funded').length}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Funded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {deals.filter(d => !['funded', 'declined'].includes(d.stage)).length}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">In Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="p-6 overflow-x-auto">
          <div className="inline-flex gap-4 pb-6" style={{ minWidth: '100%' }}>
            {STAGES.map(stage => {
              const stageDeals = getDealsForStage(stage.id)
              return (
                <div
                  key={stage.id}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(stage.id)}
                  className="flex-shrink-0 w-80"
                >
                  {/* Column Header */}
                  <div className={`${stage.color} rounded-t-xl px-4 py-4 shadow-md`}>
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-white font-bold text-lg">
                        {stage.name}
                      </h2>
                      <span className="bg-white/30 backdrop-blur-sm text-white font-bold px-3 py-1 rounded-full text-sm">
                        {stageDeals.length}
                      </span>
                    </div>
                    <p className="text-white/80 text-xs">{stage.description}</p>
                  </div>

                  {/* Column Body */}
                  <div className="bg-slate-200 dark:bg-slate-800/50 rounded-b-xl p-3 min-h-[calc(100vh-280px)] max-h-[calc(100vh-280px)] overflow-y-auto space-y-3 shadow-md">
                    {stageDeals.length === 0 ? (
                      <div className="text-center text-slate-400 dark:text-slate-600 py-8 text-sm">
                        No deals in this stage
                      </div>
                    ) : (
                      stageDeals.map(deal => (
                        <div
                          key={deal.id}
                          draggable
                          onDragStart={() => handleDragStart(deal)}
                          onClick={() => {
                            setSelectedDeal(deal)
                            setShowEditModal(true)
                          }}
                          className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-lg hover:shadow-xl cursor-move transition-all duration-200 border-l-4 border-blue-500 hover:scale-[1.02] active:scale-100 active:cursor-grabbing"
                        >
                          {/* Header with Vision Number and Assignment */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              {deal.visionNumber ? (
                                <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                                  {deal.visionNumber}
                                </div>
                              ) : (
                                <div className="font-bold text-lg text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                  </svg>
                                  No Vision #
                                </div>
                              )}
                            </div>
                            {(() => {
                              const assignee = getAssigneeInfo(deal.assignedTo)
                              return (
                                <div className={`${assignee.bgColor} ${assignee.color} px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1`}>
                                  <span>{assignee.icon}</span>
                                  <span>{assignee.name}</span>
                                </div>
                              )
                            })()}
                          </div>
                          
                          {/* Vendor */}
                          <div className="mb-2">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">VENDOR</div>
                            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                              <span className="text-lg">📦</span>
                              <span className="truncate">{deal.vendor}</span>
                            </div>
                          </div>

                          {/* Client */}
                          <div className="mb-3">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">CLIENT</div>
                            <div className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                              <span className="text-lg">👤</span>
                              <span className="truncate">{deal.client}</span>
                            </div>
                          </div>

                          {/* Folder Link */}
                          {deal.folderLink && (
                            <div className="mb-3">
                              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">FOLDER</div>
                              <a
                                href={deal.folderLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-2 text-sm font-medium underline"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                Open Folder
                              </a>
                            </div>
                          )}

                          {/* Notes */}
                          {deal.notes && (
                            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">NOTES</div>
                              <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                {deal.notes}
                              </div>
                            </div>
                          )}

                          {/* Footer with Dates */}
                          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-400">
                            <span>Created: {deal.createdAt.toLocaleDateString()}</span>
                            {deal.updatedAt && deal.updatedAt.getTime() !== deal.createdAt.getTime() && (
                              <span>Updated: {deal.updatedAt.toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Add Deal Modal */}
        {showAddModal && (
          <DealModal
            onClose={() => setShowAddModal(false)}
            onSave={addDeal}
            title="Add New Deal"
            savedVendors={savedVendors}
            savedClients={savedClients}
          />
        )}

        {/* Edit Deal Modal */}
        {showEditModal && selectedDeal && (
          <DealModal
            deal={selectedDeal}
            onClose={() => {
              setShowEditModal(false)
              setSelectedDeal(null)
            }}
            onSave={updateDeal}
            onDelete={deleteDeal}
            title="Edit Deal"
            stages={STAGES}
            savedVendors={savedVendors}
            savedClients={savedClients}
          />
        )}

        {/* Validation Error Modal */}
        {validationError && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                <div className="flex items-center gap-3 text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-xl font-bold">{validationError.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-700 dark:text-slate-300 text-lg mb-6">
                  {validationError.message}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setValidationError(null)
                      const deal = deals.find(d => d.id === validationError.dealId)
                      if (deal) {
                        setSelectedDeal(deal)
                        setShowEditModal(true)
                      }
                    }}
                    className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-base font-bold text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    Edit Deal
                  </button>
                  <button
                    onClick={() => setValidationError(null)}
                    className="flex-1 rounded-lg bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 px-4 py-3 text-base font-bold text-slate-900 dark:text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      )}
    </>
  )
}

function DealModal({ deal, onClose, onSave, onDelete, title, stages, savedVendors = [], savedClients = [] }) {
  const [formData, setFormData] = useState(deal || {
    visionNumber: '',
    vendor: '',
    client: '',
    notes: '',
    folderLink: '',
    stage: 'new-opportunity',
    assignedTo: 'unassigned',
  })
  const [showVendorDropdown, setShowVendorDropdown] = useState(false)
  const [showClientDropdown, setShowClientDropdown] = useState(false)
  const [vendorSearch, setVendorSearch] = useState(deal?.vendor || '')
  const [clientSearch, setClientSearch] = useState(deal?.client || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate Vision Number if required
    const currentStage = STAGES.find(s => s.id === formData.stage)
    if (currentStage?.requiresVision && !formData.visionNumber) {
      alert(`Vision Application Number is required for "${currentStage.name}" stage.`)
      return
    }

    onSave(formData)
  }

  const currentStage = STAGES.find(s => s.id === formData.stage)
  const visionRequired = currentStage?.requiresVision

  // Filter vendors and clients based on search
  const filteredVendors = savedVendors.filter(v => 
    v.toLowerCase().includes(vendorSearch.toLowerCase())
  )
  const filteredClients = savedClients.filter(c => 
    c.toLowerCase().includes(clientSearch.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between">
          <h3 className="text-3xl font-bold text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          
          {/* Assignment and Stage Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Assigned To *
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-4 text-lg text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none"
              >
                {TEAM_MEMBERS.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.icon} {member.name}
                  </option>
                ))}
              </select>
            </div>

            {stages && (
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                  Current Stage *
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-4 text-lg text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none"
                >
                  {stages.map(stage => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name} {stage.requiresVision ? '(Vision # Required)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Vision Number */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
              Vision Application Number
              {visionRequired && (
                <>
                  <span className="text-red-600">*</span>
                  <span className="text-xs normal-case text-red-600 font-normal">
                    (Required for current stage)
                  </span>
                </>
              )}
            </label>
            <input
              type="text"
              required={visionRequired}
              value={formData.visionNumber}
              onChange={(e) => setFormData({ ...formData, visionNumber: e.target.value })}
              className={`w-full rounded-lg border-2 ${
                visionRequired && !formData.visionNumber 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-slate-300 dark:border-slate-600'
              } bg-white dark:bg-slate-800 px-4 py-4 text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none`}
              placeholder="VIS-2024-XXX (Leave blank for new opportunities)"
            />
            {!visionRequired && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                💡 Vision Number can be added later when moving to Credit Pending stage
              </p>
            )}
          </div>

          {/* Vendor and Client Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Vendor Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={vendorSearch}
                  onChange={(e) => {
                    setVendorSearch(e.target.value)
                    setFormData({ ...formData, vendor: e.target.value })
                    setShowVendorDropdown(true)
                  }}
                  onFocus={() => setShowVendorDropdown(true)}
                  className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-4 text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none"
                  placeholder="Enter or select vendor"
                />
                {showVendorDropdown && savedVendors.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredVendors.length > 0 ? (
                      filteredVendors.map((vendor, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setVendorSearch(vendor)
                            setFormData({ ...formData, vendor })
                            setShowVendorDropdown(false)
                          }}
                          className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer text-slate-900 dark:text-white"
                        >
                          📦 {vendor}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-slate-500 dark:text-slate-400 italic">
                        No matching vendors - will create new
                      </div>
                    )}
                  </div>
                )}
              </div>
              {savedVendors.length > 0 && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  💡 Start typing to filter {savedVendors.length} saved vendor{savedVendors.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Client Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value)
                    setFormData({ ...formData, client: e.target.value })
                    setShowClientDropdown(true)
                  }}
                  onFocus={() => setShowClientDropdown(true)}
                  className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-4 text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none"
                  placeholder="Enter or select client"
                />
                {showClientDropdown && savedClients.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setClientSearch(client)
                            setFormData({ ...formData, client })
                            setShowClientDropdown(false)
                          }}
                          className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer text-slate-900 dark:text-white"
                        >
                          👤 {client}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-slate-500 dark:text-slate-400 italic">
                        No matching clients - will create new
                      </div>
                    )}
                  </div>
                )}
              </div>
              {savedClients.length > 0 && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  💡 Start typing to filter {savedClients.length} saved client{savedClients.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          {/* Folder Link */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
              Link to Folder
            </label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <input
                type="url"
                value={formData.folderLink}
                onChange={(e) => setFormData({ ...formData, folderLink: e.target.value })}
                className="w-full pl-12 pr-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-4 text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none"
                placeholder="https://drive.google.com/... or Dropbox/OneDrive link"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              💡 Paste a link to Google Drive, Dropbox, OneDrive, or any folder containing deal files
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
              Notes & Follow-up Items
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={5}
              className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-4 text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none resize-none"
              placeholder="• Missing documents&#10;• Follow-up needed&#10;• Special conditions&#10;• Audit corrections needed"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-6 flex gap-3">
          {onDelete && deal && (
            <button
              type="button"
              onClick={() => onDelete(deal.id)}
              className="rounded-lg bg-red-600 hover:bg-red-700 px-6 py-3 text-lg font-bold text-white shadow-lg hover:shadow-xl transition-all"
            >
              Delete Deal
            </button>
          )}
          <div className="flex-1"></div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 px-6 py-3 text-lg font-bold text-slate-900 dark:text-white shadow-lg hover:shadow-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-bold text-white shadow-lg hover:shadow-xl transition-all"
          >
            Save Deal
          </button>
        </div>
      </div>
    </div>
  )
}
