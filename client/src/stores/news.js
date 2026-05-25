import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useNewsStore = defineStore('news', () => {
  const latest = ref([])
  const list = ref([])
  const total = ref(0)
  const loading = ref(false)

  async function fetchLatest() {
    const { data } = await axios.get('/api/news/latest')
    latest.value = data
  }

  async function fetchList(params = {}) {
    loading.value = true
    try {
      const { data } = await axios.get('/api/news', { params })
      list.value = data.data
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  async function triggerFetch() {
    const { data } = await axios.post('/api/news/fetch')
    return data
  }

  return { latest, list, total, loading, fetchLatest, fetchList, triggerFetch }
})
