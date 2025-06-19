<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

type CalendarEvent = {
  title: string
  start: string
  end: string
}

const calendarEvents = ref<CalendarEvent[]>([
  {
    title: 'Testtermin',
    start: new Date().toISOString(),
    end: new Date(Date.now() + 3600000).toISOString() // +1h
  }
])

// Definiere die Optionen hier, da die Plugins direkt verwendet werden
const calendarOptions = ref({
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin
  ],
  initialView: 'timeGridWeek', // Deine gewünschte Startansicht
  events: calendarEvents.value, // Bindet die Events
  selectable: true,
  // Hier könnten weitere Optionen stehen, z.B. eventClick, dateClick etc.
})

// Optional: isCalendarReady, falls der Fehler weiterhin auftritt,
// um sicherzustellen, dass FullCalendar wirklich erst nach dem Mount rendert.
// In Kombination mit <ClientOnly> ist es oft nicht nötig, schadet aber auch nicht.
const isCalendarReady = ref(false)
onMounted(() => {
  isCalendarReady.value = true
})
</script>

<template>
  <ClientOnly>
    <FullCalendar
      v-if="isCalendarReady"
      :options="calendarOptions"
    />
    <div v-else>
      Kalender wird geladen...
    </div>
  </ClientOnly>
</template>