<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  selectable: true,
  editable: false,
  height: 'auto',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  events: [
    {
      title: 'Beispiel-Termin',
      start: new Date().toISOString().slice(0, 10) + 'T10:00:00',
      end: new Date().toISOString().slice(0, 10) + 'T11:00:00'
    }
  ],
  select: (info: any) => {
    alert(`Ausgewählt: ${info.startStr} bis ${info.endStr}`)
  },
  eventClick: (info: any) => {
    alert(`Geklickt: ${info.event.title}`)
  }
}
</script>

<template>
  <FullCalendar :options="calendarOptions" />
</template>
