<template>
<div>
  
  <div class="box container" v-for="query in queries">
    <h1>{{query.prompt}}</h1>
    <form @submit="processQuery(query, $event)">
      <div v-for="data in query.data" class="field">
        <label class="label" :for="data.name">{{data.prompt}}</label>
        <div class="control" v-model="data.value">
          <select v-if="data.type == 'select'" class="input" name="" :id="data.name" v-model="data.value">
            <option v-for="op in collection.related[data.suggest.related]" :value="op[data.suggest.value]">
              {{op[data.suggest.text]}}
            </option>
          </select>
          <textarea v-else-if="data.type == 'textarea'" class="input" name="" :type="data.type" :id="data.name" v-model="data.value">
          </textarea>
          <input v-else class="input" name="" :type="data.type" :id="data.name" v-model="data.value">
        </div>
      </div>
    </form>
  </div>
  

</div>

</template>

<script>

export default {
  name: 'CollectionQueries',
  props: [
    'queries'
  ],
  data: function() {
    return {
    }
  },
  computed: {
    queryGroups: function() {
      return this.queries.reduce(function (res, el) {
        if ( el.rel.includes('current')) {
          res.current= el;
        } else if (el.rel.includes('prev')) {
          res.prev = el;
        } else if (el.rel.includes('next')) {
          res.next = el;
        } else {
          res.other.push(el);
        }
        return res;
      }, {current: null, prev: null, next: null, other: []});
      
    }
  },
  components: {
  },
  methods: {
    // Function to process the click event on a link
    // https://vuejs.org/v2/guide/events.html#Methods-in-Inline-Handlers
    // link: the link clicked
    // event: the event object
    processQuery: function(query, event) {
      event.preventDefault();
      this.$emit('query-sent', query);
    },
    processLink: function(link, event) {
      // Prevent <a> element to load the url
      event.preventDefault();
      // Emit the event link-clicked. The App component will listen to it and it will call the readCollection function.
      this.$emit('link-clicked', link.href);
    }
  }
}
</script>

<style scoped>

</style>
