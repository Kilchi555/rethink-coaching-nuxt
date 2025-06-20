<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import CalendarComponent from '~/components/CalendarComponent.vue'

const calendarRef = ref()

const goToToday = () => {
  const api = calendarRef.value?.getApi()
  if (!api) return
  api.today()

  // 👇 manuell emit auslösen
  onViewUpdate(api.view.currentStart)
}

const goNext = () => {
  calendarRef.value?.getApi().next()
}
const goPrev = () => {
  calendarRef.value?.getApi().prev()
}

const count = ref(0)

const buttonClasses = computed(() =>
  `text-white font-bold px-4 py-2 rounded-xl shadow-lg transform active:scale-95 transition-all duration-200
   ${count.value > 0 ? 'bg-red-600 hover:bg-red-700' : 'bg-green-500 hover:bg-green-600'}`
)

const isTodayActive = ref(false)

const updateTodayState = () => {
  const api = calendarRef.value?.getApi()
  if (!api) return

  const viewStart = api.view.currentStart
  const now = new Date()

  isTodayActive.value = viewStart.getFullYear() === now.getFullYear() &&
    getWeekNumber(viewStart) === getWeekNumber(now)
}

const getWeekNumber = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

onMounted(() => {
  updateTodayState()
})
watch(calendarRef, () => {
  updateTodayState()
})

const currentMonth = ref('')

const updateCurrentMonth = () => {
  const api = calendarRef.value?.getApi()
  if (!api) return

  const date = api.getDate()
  currentMonth.value = date.toLocaleDateString('de-CH', {
    month: 'long',
    year: 'numeric',
  })
}

const onViewUpdate = (currentStart: Date) => {
  updateTodayState()
  updateCurrentMonth()
}


onMounted(() => {
  updateTodayState()
  updateCurrentMonth()
})


</script>

<template>
  <div class="fixed top-0 left-0 right-0 h-[50px] bg-white shadow z-50 flex items-center justify-between px-2">
    <div class="flex items-center gap-4">
      <div class="text-xl font-semibold text-gray-800 top-bar-text">
        {{ currentMonth }}
      </div>
    </div>

    <div class="flex gap-2">
      <button
        class="fc-button font-bold text-white px-5 py-2 rounded-xl shadow-md transition-all duration-200 transform active:scale-95 hover:bg-blue-600 disabled:bg-gray-400 bg-blue-500"
        :disabled="isTodayActive"
        @click="goToToday"
      >
        Heute
      </button>
      <button class="fc-button font-bold text-white px-5 py-2 rounded-xl shadow-md transition-all duration-200 transform active:scale-95 bg-green-500 hover:bg-green-600" @click="goPrev">‹</button>
      <button class="fc-button font-bold text-white px-5 py-2 rounded-xl shadow-md transition-all duration-200 transform active:scale-95 bg-green-500 hover:bg-green-600" @click="goNext">›</button>
    </div>

    <div class="flex gap-2 bar-button">
      <button :class="buttonClasses">
        Offene ({{ count }})
      </button>
    </div>
  </div>

  <div class="pt-[50px] pb-[50px] h-screen overflow-y-auto">
    <CalendarComponent ref="calendarRef" @view-updated="onViewUpdate" />
  </div>

  <div class="fixed bottom-0 left-0 right-0 h-[50px] bg-white shadow z-50 flex justify-around items-center px-4">
    <button class=" bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl shadow-lg transform active:scale-95 transition-all duration-200">Schülerliste</button>
    <button class=" bg-grey-600 hover:bg-grey-700 text-white font-bold px-4 py-2 rounded-xl shadow-lg transform active:scale-95 transition-all duration-200">Einstellungen</button>
  </div>
</template>

<style>
@media (max-width: 490px) {
  .top-bar-text {
    font-size: 0.875rem; /* Tailwind: text-sm */
  }

  .fc-button .bar-button {
    font-size: 0.75rem; /* Tailwind: text-xs */
    padding: 0.3rem 0.5rem;
  }
}

</style>

