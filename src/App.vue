<template>
  <div id="app">

    <main v-if="c">
      <!--  links Container  -->
      <CollectionLinks :message="c.collection.message" :title="c.collection.title" :links="c.collection.links" @link-clicked="readCollection"></CollectionLinks>

      <!-- Queries container -->
      <CollectionQueries :related="c.collection.related" :queries="c.collection.queries" @query-sent="processQuery"></CollectionQueries>

      <!-- Template Container -->
      <!-- <CollectionTemplate :createurl="c.collection.href" :template="c.collection.template" @refresh="readCollection"></CollectionTemplate> -->

      <!-- Info container -->
      <transition name="fade">
        <article v-if="displayMessage" class="message is-info">
          <div class="message-header">
            <p>Info</p>
            <!-- <button class="delete" aria-label="delete"></button> -->
          </div>
          <div class="message-body">
            {{this.message}}
          </div>
        </article>
      </transition>

      <!--  items Container  -->
      <CollectionItems :itemsReady="itemsReady" @query-sent="processQuery" :collection="c.collection" @link-clicked="readCollection" @refresh="readCollection" @showMessage="showNotificationMessage"></CollectionItems>

    </main>
  </div>
</template>

<script>
// Module to make AJAX calls to API server
import axios from 'axios';
// Import components
import CollectionLinks from './components/CollectionLinks';
import CollectionQueries from './components/CollectionQueries';
import CollectionItems from './components/CollectionItems';

export default {
  name: 'App',

  // Initialization:
  // Function that runs when the component is created
	// When the app ploads, it connects to the entry point of the API, "/api", to get a collection object
	// The collection object is stored in "c"
  created: function() {
    // AJAX request to /api (entry point of the app)
    if (process.env.NODE_ENV == 'test') {
      this.readCollection('/api');
    } else {
      this.readCollection(window.location);
    }
    // History back
    // Attach onpopstate event handler
    if (typeof window !== 'undefined') {
      window.onpopstate = function(event) {
        this.readCollection(event.state.path, true);
      }.bind(this);
    }
  },

  // Component data
  data: function() {
    return {
      // This variable will store the Collection + JSON object returned by the server
      c: null,
      message: "",
      displayMessage: false,
      itemsReady: false
    }
  },

  // Components used by this component
  components: {
    CollectionItems,
    CollectionQueries,
    CollectionLinks
  },

  // Methods
  methods: {
    readCollection: function(url, noPush) {
	    // Method to do a GET request to a URL
	    // It must be called when the user clicks on a LINK
	    // url: URL of the selected link (the "href" property of the link)
	    // http://amundsen.com/media-types/collection/format/#general
      this.itemsReady = false;
      axios.get(url)
           .then(response => {
             // If success, store data returned by the server (the collection + JSON object) in the 'c' property of the component
             this.c = response.data;
             this.itemsReady = true;
             // History state
             if (! noPush)
	             window.history.pushState({path: url}, this.c.collection.title, url);
           })
           .catch(e => {
             // If error, display in console
             console.log(e);
           });

    },
    processQuery: function(query) {
      const params = new URLSearchParams();
      // For charts to work with updated data from query
      this.itemsReady = false;

      for (var d of query.data) {
        params.append(d.name, d.value);
      }

      const urlQuery = query.href + '?' + params.toString();

      axios.get(urlQuery)
           .then(response => {
             // If success, store data returned by the server (the collection + JSON object) in the 'c' property of the component
             this.c = response.data;
             this.itemsReady = true;
             // History state
	           window.history.pushState({path: urlQuery}, this.c.collection.title, urlQuery);
           })
           .catch(e => {
             // If error, display in console
             console.log(e);
           });

    },
    showNotificationMessage: function(message) {
      this.message = message;
      this.displayMessage = true;
      setTimeout(function(){
        this.message = "";
        this.displayMessage = false;
      }.bind(this), 3000);
    }
  }
}
</script>

<style scoped>

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .message {
    position: fixed;
    margin: auto;
    bottom: 0;
    z-index: 20;
    width: 80%;
    left: 10%;
  }

</style>
