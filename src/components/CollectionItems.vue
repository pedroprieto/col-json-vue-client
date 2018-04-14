<template>
<div>
  <!-- Inside this component you should display the collection.items object available in the 'collection' prop.
       
       This component will display a basic 'item' container for each item in the collection.items array. It will display:
       
       - The item data
       - A link to the item url available in item.href
       - A link/button for deleting the item
       - The edit form component
       
       
       This component should display the right component for each collection type. E.g. if it is a "books" collection, the component "items-books" must be displayed, showing the books in the appropriate format; if it is a "movies" collection, the component "items-movies" must be displayed, showing the movies in the appropriate format. 
       
       https://vuejs.org/v2/guide/conditional.html
       
       
       When the user clicks on the item link, the function "processLink" will be called.
       
       When the user clicks on the delete button, the function "deleteItem" will be called.
       
    -->
  
  <!-- https://vuejs.org/v2/guide/components.html#Custom-Events -->
  
  <!-- Template form component for creating and editing items -->

  <TemplateForm @refresh="refresh" @close="hideEditForm" :collection="collection" :visible="editFormVisible" :item="selectedItem"></TemplateForm>


  <!-- Button to add items -->
  <button v-if="collection.template" @click="showEditForm(null, $event)" class="button is-primary">Add</button>
  
  <div class="box" v-for="item in collection.items" >
    
    <div class="columns">
      
      <!-- Action buttons -->
      <div class="buttons">
        <a class="button is-primary" @click="showEditForm(item,$event)">Edit</a>
        <a class="button is-info" :href="item.href" @click="processLink(item,$event)">Read</a>
        <a class="button is-danger" v-on:click="deleteItem(item)">Delete</a>
      </div>
      
      <!-- Item links -->
      <div class="buttons">
        <a v-for="link in item.links" class="button" :href="link.href" @click="processLink(link,$event)">{{link.prompt}}</a>
      </div>

    </div>

    <!-- Item data -->
    <table class="table table is-fullwidth">
      <tr v-for="data in item.data">
        <th>{{data.prompt}}</th>
        <td>{{data.value}}</td>
      </tr>
    </table>

  </div>

</div>

</template>

<script>
import axios from 'axios';
// Import components
import TemplateForm from './TemplateForm';

export default {
  name: 'CollectionItems',
  props: [
    // This prop stores the collection object
    'collection'
  ],
  data: function() {
    return {
      editFormVisible: false,
      selectedItem: null
    }
  },
  components: {
    TemplateForm
  },
  methods: {
    // Function to process the click event on a link
    // https://vuejs.org/v2/guide/events.html#Methods-in-Inline-Handlers
    // link: the link clicked
    // event: the event object
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
    },
    deleteItem: function(item) {
	    // Method to do a DELETE request to delete an item
	    // item: the item to be deleted
	    // It must be called when the user clicks on the DELETE ITEM button for a given item
	    // http://amundsen.com/media-types/collection/format/#general
      if (confirm("Ready to delete?") === true)
        axios.delete(item.href)
        .then(function (response) {
          // Emit an event to read again the collection
          // The App component will listen to the 'refresh' event and it will call the readCollection method
          this.$emit('refresh', this.collection.href);
        }.bind(this))
        .catch(e => {
          // If error, display in console
          console.log(e);
        });
    },
    showEditForm: function(item, $event) {
      this.selectedItem = item;
      this.editFormVisible = true;
      
    },
    hideEditForm: function() {
      this.editFormVisible = false;
    },
  }
}
</script>

<style scoped>

</style>
