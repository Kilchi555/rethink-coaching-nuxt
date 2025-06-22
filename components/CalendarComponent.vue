<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { type CalendarOptions } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import deLocale from '@fullcalendar/core/locales/de'

const calendar = ref()

defineExpose({
  getApi: () => calendar.value?.getApi?.()
})

type CalendarEvent = {
  title: string
  start: string
  end: string
  extendedProps?: {
    location?: string
    staff_note?: string
    client_note?: string
  }
}

const calendarEvents = ref<CalendarEvent[]>([
  {
    title: 'Test-Termin',
    start: new Date().toISOString(),
    end: new Date(Date.now() + 3600000).toISOString(),
    extendedProps: {
      location: 'Zürich',
      staff_note: 'Achtung: Spezialfall'
    }
  }
])

const emit = defineEmits(['view-updated'])


// Definiere die Optionen hier, da die Plugins direkt verwendet werden
const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  locale: deLocale,
  timeZone: 'local',
  height: 'auto',
  stickyHeaderDates: true,
  headerToolbar: false,
  selectable: true,
  editable: true,
  selectMirror: true,
  events: calendarEvents.value,
  slotMinTime: '06:00:00',
  slotMaxTime: '22:00:00',
  allDaySlot: false,
  datesSet(info) {
  emit('view-updated', info.start)
  },
  eventAllow: (dropInfo: any) => {
    const now = new Date()
    return dropInfo.start > now
  },

  dayHeaderContent: (arg: any) => {
  const date = arg.date
  const weekday = date.toLocaleDateString('de-CH', { weekday: 'short' }) // z. B. "Mo"
  const day = date.getDate().toString().padStart(2, '0') // z. B. "24"

  return {
    html: `<div class="fc-day-header-content"><span class="block">${weekday}</span><span class="block">${day}</span></div>`
   }
  },

  eventContent: (arg: any) => {
    const { title, location } = arg.event
    const ext = arg.event.extendedProps
    return {
      html: `
        <div class="fc-event-custom">
          <div class="event-name">${title || 'Termin'}</div>
          ${ext?.location ? `<div class="event-subline">📍 ${ext.location}</div>` : ''}
        </div>
      `
    }
  },
})

// Optional: isCalendarReady, falls der Fehler weiterhin auftritt,
// um sicherzustellen, dass FullCalendar wirklich erst nach dem Mount rendert.
// In Kombination mit <ClientOnly> ist es oft nicht nötig, schadet aber auch nicht.
const isCalendarReady = ref(false)
onMounted(() => {
  isCalendarReady.value = true
  emit('view-updated', calendar.value?.getApi()?.view?.currentStart)
})
</script>

<template>
  <ClientOnly>
    <FullCalendar
      v-if="isCalendarReady"
      ref="calendar"
      :options="calendarOptions"
    />
    <div v-else>
      Kalender wird geladen...
    </div>
  </ClientOnly>
</template>

<style>
.fc-event-custom {
  font-size: 0.75rem;
  padding: 2px;
}
.event-name {
  font-weight: bold;
}
.event-subline {
  font-size: 0.75rem;
  color: #4b5563;
}
.fc .fc-timegrid-slot-label-cushion {
  font-size: 0.7rem;  /* entspricht text-xs */
  color: #6b7280;      /* Tailwind text-gray-500 */
  padding-left: 0.15rem;
}

/* 🧱 Wichtig: Toolbar wird als Flexbox behandelt */
.fc .fc-toolbar {
  display: flex;
  align-items: center;        /* ⬅️ vertikal mittig ausrichten */
  justify-content: center;    /* ⬅️ horizontal zentrieren (optional) */
  min-height: 3.5rem;         /* ⬅️ genug Höhe für zentriertes Layout */
}

/* 🧱 Jedes Button-Chunk innerhalb zentrieren */
.fc .fc-toolbar-chunk {
  display: flex;
  align-items: center;
}

/* 🎯 Optional: Style für die Buttons */
.fc .fc-button {
  padding: 0.5rem 0.5rem !important;
  font-size: 0.875rem;
  line-height: 1.25rem;
  z-index: 100;
}

</style>