import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useModelsStore = defineStore('models', () => {
  const list = ref([])
  const dailyPick = ref(null)
  const categories = ref({ scenes: {}, types: {} })
  const loading = ref(false)

  async function fetchList(params = {}) {
    loading.value = true
    try {
      const { data } = await axios.get('/api/models', { params })
      list.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchDailyPick() {
    const { data } = await axios.get('/api/models/daily-pick')
    dailyPick.value = data
  }

  async function fetchCategories() {
    const { data } = await axios.get('/api/models/categories')
    categories.value = data
  }

  return { list, dailyPick, categories, loading, fetchList, fetchDailyPick, fetchCategories }
})
