import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useProductsStore = defineStore('products', () => {
  const list = ref([])
  const dailyPick = ref(null)
  const loading = ref(false)

  async function fetchList(params = {}) {
    loading.value = true
    try {
      const { data } = await axios.get('/api/products', { params })
      list.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchDailyPick() {
    const { data } = await axios.get('/api/products/daily-pick')
    dailyPick.value = data
  }

  return { list, dailyPick, loading, fetchList, fetchDailyPick }
})
