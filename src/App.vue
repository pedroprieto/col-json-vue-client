<template>
<div id="app">
  <header>
    <!-- Display collection title -->
    <h1 class="text-center">{{c.collection.title}}</h1>
  </header>
  
  <main>
    <!--  links Container  -->
    <CollectionLinks :links="c.collection.links" @link-clicked="readCollection"></CollectionLinks>

    <!-- Template Container -->
    <!-- <CollectionTemplate :createurl="c.collection.href" :template="c.collection.template" @refresh="readCollection"></CollectionTemplate> -->

    <!--  items Container  -->
    <CollectionItems :collection="c.collection" @link-clicked="readCollection" @refresh="readCollection"></CollectionItems>
    
  </main>
</div>
</template>

<script>
// Module to make AJAX calls to API server
import axios from 'axios';
// Import components
import CollectionLinks from './components/CollectionLinks';
import CollectionItems from './components/CollectionItems';

export default {
  name: 'App',
  
  // Initialization:
  // Function that runs when the component is created
	// When the app ploads, it connects to the entry point of the API, "/api", to get a collection object
	// The collection object is stored in "c"
  created: function() {
    // AJAX request to /api (entry point of the app)
    this.readCollection('/api');
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
      c: null
    }
  },
  
  // Components used by this component
  components: {
    CollectionItems,
    CollectionLinks
  },
  
  // Methods
  methods: {
    readCollection: function(url, noPush) {
	    // Method to do a GET request to a URL
	    // It must be called when the user clicks on a LINK
	    // url: URL of the selected link (the "href" property of the link)
	    // http://amundsen.com/media-types/collection/format/#general
      axios.get(url)
        .then(response => {
          // If success, store data returned by the server (the collection + JSON object) in the 'c' property of the component
          this.c = response.data;
          // History state
          if (! noPush)
	          window.history.pushState({path: url}, this.c.collection.title, url);
        })
        .catch(e => {
          // If error, display in console
          console.log(e);
        });
      
    }
  }
}
</script>

<style scoped>

</style>
