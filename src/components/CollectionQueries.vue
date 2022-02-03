<template>
  <div>
    <div class="box container" v-for="query in queries" v-if="query.rel.indexOf('specific') == -1">
      <h2 class="subtitle is-4">{{query.prompt}}</h2>
      <form @submit="processQuery(query, $event)" class="">
        <div class="field is-horizontal">
          <div class="field-body">
            <div v-for="data in query.data" class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label is-normal" :for="data.name">{{data.prompt}}</label>
              </div>
              <div class="field-body field">
                <div class="field">
                  <div class="control is-expanded" v-model="data.value">
                    <div class="select is-fullwidth" v-if="data.type == 'select'" >
                      <select name="" :id="data.name" v-model="data.value">
                        <option v-for="op in related[data.suggest.related]" :value="op[data.suggest.value]">
                          {{op[data.suggest.text]}}
                        </option>
                      </select>
                    </div>

                    <textarea v-else-if="data.type == 'textarea'" class="input" name="" :type="data.type" :id="data.name" v-model="data.value">
                    </textarea>
                    <input v-else-if="data.type == 'checkbox'" class="checkbox" name="" :type="data.type" :id="data.name" v-model="data.value">
                    <input v-else class="input" name="" :type="data.type" :id="data.name" v-model="data.value">
                  </div>
                </div>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button class="button is-primary is-fullwidth" name="" type="submit" value="">Enviar</button>
              </div>
            </div>
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
    'queries',
    'related'
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
