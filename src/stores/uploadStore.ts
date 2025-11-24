import { create } from 'zustand'
import { MediaInfoResult } from '@/types/UploadTorrentPage'

interface UploadState {
  selectedCategory: string
  selectedSubCategories: string[]
  selectedLanguages: string[]
  selectedSubtitles: string[]
  uploadedPoster: string
  screenshots: string[]
  isAnonymous: boolean
  ptGenUrl: string
  ptGenLoading: boolean
  ptGenError: string | null
  description: string
  title: string
  subTitle: string
  productionTeam: string
  region: string
  imdbUrl: string
  doubanUrl: string
  torrentFile: File | null
  submitting: boolean
  videoResolution: string
  videoStandard: string
  audioFormat: string
  videoFormat: string
  mediaInfoText: string
  mediaInfo: MediaInfoResult

  setSelectedCategory: (id: string) => void
  setSelectedSubCategories: (ids: string[]) => void
  toggleSubCategory: (id: string) => void
  toggleLanguage: (lang: string) => void
  toggleSubtitle: (sub: string) => void
  setUploadedPoster: (url: string) => void
  clearUploadedPoster: () => void
  addScreenshots: (urls: string[]) => void
  removeScreenshot: (index: number) => void
  setIsAnonymous: (val: boolean) => void
  setTitle: (v: string) => void
  setSubTitle: (v: string) => void
  setDescription: (v: string) => void
  setProductionTeam: (v: string) => void
  setRegion: (v: string) => void
  setImdbUrl: (v: string) => void
  setDoubanUrl: (v: string) => void
  setPtGenUrl: (v: string) => void
  setPtGenLoading: (v: boolean) => void
  setPtGenError: (v: string | null) => void
  setTorrentFile: (f: File | null) => void
  setSubmitting: (v: boolean) => void
  setVideoResolution: (v: string) => void
  setVideoStandard: (v: string) => void
  setAudioFormat: (v: string) => void
  setVideoFormat: (v: string) => void
  setMediaInfoText: (v: string) => void
  setMediaInfo: (v: MediaInfoResult) => void
}

export const useUploadStore = create<UploadState>((set, get) => ({
  selectedCategory: '',
  selectedSubCategories: [],
  selectedLanguages: [],
  selectedSubtitles: [],
  uploadedPoster: '',
  screenshots: [],
  isAnonymous: false,
  ptGenUrl: '',
  ptGenLoading: false,
  ptGenError: null,
  description: '',
  title: '',
  subTitle: '',
  productionTeam: '',
  region: '',
  imdbUrl: '',
  doubanUrl: '',
  torrentFile: null,
  submitting: false,
  videoResolution: '',
  videoStandard: '',
  audioFormat: '',
  videoFormat: '',
  mediaInfoText: '',
  mediaInfo: {},

  setSelectedCategory: (id) => set({ selectedCategory: id, selectedSubCategories: [] }),
  setSelectedSubCategories: (ids) => set({ selectedSubCategories: ids }),
  toggleSubCategory: (id) => {
    const cur = get().selectedSubCategories
    set({
      selectedSubCategories: cur.includes(id) ? cur.filter(v => v !== id) : [...cur, id],
    })
  },
  toggleLanguage: (lang) => {
    const cur = get().selectedLanguages
    set({ selectedLanguages: cur.includes(lang) ? cur.filter(v => v !== lang) : [...cur, lang] })
  },
  toggleSubtitle: (sub) => {
    const cur = get().selectedSubtitles
    set({ selectedSubtitles: cur.includes(sub) ? cur.filter(v => v !== sub) : [...cur, sub] })
  },
  setUploadedPoster: (url) => set({ uploadedPoster: url }),
  clearUploadedPoster: () => set({ uploadedPoster: '' }),
  addScreenshots: (urls) => set({ screenshots: [...get().screenshots, ...urls] }),
  removeScreenshot: (index) => set({ screenshots: get().screenshots.filter((_, i) => i !== index) }),
  setIsAnonymous: (val) => set({ isAnonymous: val }),
  setTitle: (v) => set({ title: v }),
  setSubTitle: (v) => set({ subTitle: v }),
  setDescription: (v) => set({ description: v }),
  setProductionTeam: (v) => set({ productionTeam: v }),
  setRegion: (v) => set({ region: v }),
  setImdbUrl: (v) => set({ imdbUrl: v }),
  setDoubanUrl: (v) => set({ doubanUrl: v }),
  setPtGenUrl: (v) => set({ ptGenUrl: v }),
  setPtGenLoading: (v) => set({ ptGenLoading: v }),
  setPtGenError: (v) => set({ ptGenError: v }),
  setTorrentFile: (f) => set({ torrentFile: f }),
  setSubmitting: (v) => set({ submitting: v }),
  setVideoResolution: (v) => set({ videoResolution: v }),
  setVideoStandard: (v) => set({ videoStandard: v }),
  setAudioFormat: (v) => set({ audioFormat: v }),
  setVideoFormat: (v) => set({ videoFormat: v }),
  setMediaInfoText: (v) => set({ mediaInfoText: v }),
  setMediaInfo: (v) => set({ mediaInfo: v }),
}))