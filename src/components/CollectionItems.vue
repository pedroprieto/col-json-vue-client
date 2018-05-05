<template>
<div>
  
  <TemplateForm @showMessage="showMessage" v-if="collection.template && collection.type!='template'" @refresh="refresh" @close="hideEditForm" :collection="collection" :visible="editFormVisible" :item="selectedItem"></TemplateForm>

  <div v-if="collection.template && collection.type=='template'" class="container">
    <TemplateData @showMessage="showMessage" @refresh="refresh" :collection="collection" :item="selectedItem"></TemplateData>
  </div>
  
  
  <!-- Button to add items -->
  <div class="box container" v-if="collection.template && collection.type!='template'">
      <div class="level-item ">
        <button @click="showEditForm(null, $event)" class="level-item button is-primary is-medium">Nuevo</button>
      </div>
  </div>

  <CollectionItemsAgenda v-if="collection.type && collection.type=='agenda'" :collection="collection" @link-clicked="refresh" @refresh="refresh">

  </CollectionItemsAgenda>

  <CollectionItemsGeneric v-else :collection="collection" @deleteItem="deleteItem" @showEditForm="showEditForm" @link-clicked="refresh" @refresh="refresh">

  </CollectionItemsGeneric>

</div>

</template>

<script>
import axios from 'axios';
// Import components
import TemplateForm from './TemplateForm';
import TemplateData from './TemplateData';
import CollectionItemsGeneric from './CollectionItemsGeneric';
import CollectionItemsAgenda from './CollectionItemsAgenda';

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
    TemplateForm,
    TemplateData,
    CollectionItemsGeneric,
    CollectionItemsAgenda
  },
  methods: {
    // Function to process the click event on a link
    // https://vuejs.org/v2/guide/events.html#Methods-in-Inline-Handlers
    // link: the link clicked
    // event: the event object
    processLink: function(link, event) {
      // Prevent <a> element to load the url
      event.preventDefault();
      // Hide possible visible form
      this.editFormVisible = false;
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
          // Show success message
          this.$emit('showMessage', "Elemento borrado con éxito");
        }.bind(this))
        .catch(e => {
          // If error, display in console
          this.$emit('showMessage', "Ocurrió un error al actualizar el elemento");
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
    showMessage: function(message) {
      this.$emit('showMessage', message);
    }
  }
}
</script>

<style scoped>

</style>
