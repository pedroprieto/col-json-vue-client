<template>
<div >
  <!-- <div> -->
  <!--   Hora -->
  <!--   <div v-for="hour in collection.meta.availableHours"> -->
  <!--     {{hour}} -->
  <!--   </div> -->
  
  <!-- </div> -->
  <!-- <div v-for="(el,index) in csPerDay"> -->
  <!--   {{index}} -->
  <!--   <div v-for="item in el"> -->
  <!--     a -->
  <!--     <span v-for="l in item.links"> -->
  <!--       <a @click="processLink(l,$event)" :href="l.href">{{l.prompt}}</a> -->
  <!--     </span> -->
  <!--   </div> -->
  
  <!-- </div> -->
  
  <div class="schedule">
    <div>
      Hora
    </div>
    <div v-for="day in collection.meta.listOfDays">
      {{new Date(day).toLocaleDateString('es',{ weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}}
    </div>
  </div>
  
  
  <div v-for="(el,index) in csPerHour">
    <div class="schedule" >
      <div>
        {{index}}
      </div>
      <div class="cell" v-for="item in el" >
        <div v-for="l in item.links">
          <a v-if="! l.rel.includes('template')" @click="processLink(l,$event)" :href="l.href">
            <span class="tag">
              {{l.prompt}}
            </span>
          </a>

          <a class="add-link" v-if="l.rel.includes('template')" @click="processLink(l,$event)" :href="l.href">
            <span class="icon is-small">
              <span class="oi" data-glyph="plus"></span>
              <!-- {{l.prompt}} -->
            </span>
          </a>
          
        </div>
      </div>
    </div>
    
  </div>

</div>

</template>

<script>

export default {
  name: 'CollectionItemsAgenda',
  props: [
    // This prop stores the collection object
    'collection'
  ],
  data: function() {
    return {
    }
  },
  components: {
  },
  computed: {
    // csPerDay: function() {
    //   return this.collection.items.reduce(function (res, el) {
    //     res[el.group] = res[el.group] || [];
    //     res[el.group].push(el);
    //     console.log(res);
    //     return res;
    //   }, Object.create(null));
      
    // },
    csPerHour: function() {
      return this.collection.items.reduce(function (res, el) {
        res[el.hour] = res[el.hour] || [];
        res[el.hour].push(el);
        return res;
      }, Object.create(null));
      
    }
  },
  methods: {
    processLink: function(link, event) {
      // Prevent <a> element to load the url
      event.preventDefault();
      // Emit the event link-clicked. The App component will listen to it and it will call the readCollection function.
      this.$emit('link-clicked', link.href);
    },
    // Function that runs to reload the item.url after an item update
    refresh: function(url) {
      console.log(url);
      console.log('refresh');
      this.$emit('refresh', url);
    }
  }
}
</script>

<style scoped>

.schedule {
    display: flex;
    min-height: 2em;
    /* align-items: stretch; */
    flex-direction: row;
}

.schedule>div {
    flex: 1 1 0;
    border: 1px solid black;
    text-align: center;
    padding: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.75rem;
    }

.cell {
    position: relative;
    }

.add-link {
    font-size: 0.7rem;
    position: absolute;
    right: 1px;
    top: 1px;
    }

</style>
