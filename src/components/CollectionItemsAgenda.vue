<template>
  <div class="box container">

    <!-- TODO: parametrize -->
    <vue-cal
      style="height: 600px;"
      locale="es"
      :selected-date="selectedDate"
      :default-view="selectedView"
      :time-from="8 * 60"
      :time-to="21 * 60"
      :time-step="30"
      :on-event-create="createEvent"
      @event-drop="dropEvent"
      :snap-to-time="30"
      :editable-events="{ title: false, drag: true, resize: false, delete: false, create: true}"
      @view-change="fetchEvents"
      :on-event-dblclick="eventClick"
      class="vuecal--blue-theme"
      events-on-month-view="short"
      today-button
      :events="processedItems.events"
    >
      <template v-slot:time-cell="{ hours, minutes }">
        <div :class="{ line: true, hours: !minutes }">
          <strong v-if="!minutes" style="font-size: 15px">{{ hours }}</strong>
          <span v-else style="font-size: 11px">{{ minutes }}</span>
        </div>
      </template>

      <template v-slot:event="{ event, view }">
        <div class="vuecal__event-title" :title="event.title" >
          {{event.title}}
        </div>
      </template>
    </vue-cal>

  </div>

</template>

<script>
import axios from 'axios';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import 'vue-cal/dist/drag-and-drop.js'
import 'vue-cal/dist/i18n/es.js'

export default {
  name: 'CollectionItemsAgenda',
  props: [
    // This prop stores the collection object
    'collection'
  ],
  data: function() {
    return {
      selectedDate: new Date(),
      selectedView: 'week'
    }
  },
  created: function() {
    // Adjust current view and selected date based on href query
    if (window.location.search) {
      var params = new URLSearchParams(window.location.search);
      const dB = params.get('dateBegin');
      const v = params.get('view');
      if (params.get('dateBegin'))
        this.selectedDate = new Date(dB);
      if (params.get('view'))
        this.selectedView = v;
    }
  },
  components: {
    VueCal
  },
  computed: {
    processedItems: function() {
      var resul = this.collection.items.reduce((res, el) => {
        var it = {};
        if (el.data) {

          it = el.data.reduce((res,el) => {
            res[el.name] = el.value;
            return res;
          }, it);

        }

        it.origItem = el;
        it.href = el.href;
        it.editTemplate = Object.assign({}, this.collection.template);

        if (el.group == "consultation") {
          it.startDate = new Date(it.start);
          it.endDate = new Date(it.end);
          it.class = it.kind;
          res.events.push(it);
        } else if (el.group == "availableHour") {
          it.daysOfWeek = [it.daysOfWeek];
          res.businessHours.push(it);
        }
        return res;

      }, {events: [], businessHours: []})
      return resul;

    }
  },
  methods: {
    eventClick(event, e) {
      this.$emit('link-clicked', event.origItem.href);
      e.stopPropagation()
    },
    dropEvent: function(info) {
      for (var d of info.event.editTemplate.data) {
        if (d.name == 'date')
          d.value = info.event.startDate.toISOString();
      }
      // Update
      var editTemplate = {
        template: info.event.editTemplate
      }
      axios.put(info.event.href, editTemplate)
           .then(function (response) {
             // Emit an event to read again the collection
             // The App component will listen to the 'refresh' event and it will call the readCollection method
             // this.$emit('refresh', response.headers.location || location.href);
             this.$emit('refresh', window.location.href);
             this.$emit('showMessage', "Elemento actualizado con éxito");
           }.bind(this))
           .catch(e => {
             // If error, display in console
             this.$emit('showMessage', "Ocurrió un error al actualizar el elemento");
             console.log(e);
           });

    },
    createEvent: function(event,b) {
      if (typeof event.origItem !== 'undefined') {
        // Dropping a dragged event
        return event;
      } else {
        // Creating an event
        // Look for 'searchpatient' query
        var roundedDate = event.startDate;
        var hour = roundedDate.getHours();
        var minutes = roundedDate.getMinutes();
        if (minutes > 30) {
          roundedDate.setMinutes(30);
        } else {
          roundedDate.setMinutes(0);
        }
        var dateBegin = roundedDate.toISOString();
        var searchPatient = this.collection.queries.filter(q=>{
          return q.rel.indexOf('searchpatient') > -1;
})[0];
        for (var d of searchPatient.data) {
          if (d.name == 'date')
            d.value = dateBegin;
        }
        this.$emit('query-sent',searchPatient);
      }
    },
    fetchEvents ({ view, startDate, endDate, week }) {
      var dateBegin = startDate.format('YYYY-MM-DD');
      var dateEnd = endDate.format('YYYY-MM-DD');
      // Look for 'search' query
      if (this.collection.queries) {

        var searchQuery = this.collection.queries.filter(q=>{
          return q.rel.indexOf('search') > -1;
})[0];
        for (var d of searchQuery.data) {
          if (d.name == 'dateBegin')
            d.value = dateBegin;
          if (d.name == 'dateEnd')
            d.value = dateEnd;
          if (d.name == 'view')
            d.value = view;
        }
        this.$emit('query-sent',searchQuery);
      }
    }
  }
}
</script>

<style>
  .vuecal__event {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2em;
    background-color: rgba(164,230,210,.9);
    border: 1px solid #90d2be;
    color: #666;
  }
  .vuecal__event.voucher {
    background-color: rgba(253, 156, 66, 0.9);
    border: 1px solid rgb(233, 136, 46);
    color: #fff;
  }
  /* .vuecal__event.voucher:before {
     content: "\2605";
     } */
  .vuecal__event.invoice {
    background-color: rgba(255, 102, 102, 0.9);
    border: 1px solid rgb(235, 82, 82);
    color: #fff;
  }
  .vuecal__event-title {
    font-size: 0.9em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
