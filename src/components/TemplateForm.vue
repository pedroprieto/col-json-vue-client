<template>

<!-- This component will build a web form to display the collection.template available in the 'template' prop. This form will be bound to the 'template' prop. When the form is submitted, the method 'createItem' will be called to send the data to the server and create a new item. -->

<!-- How to bind form inputs to data: https://vuejs.org/v2/guide/forms.html -->

<!-- Listening to events: https://vuejs.org/v2/guide/events.html -->

<div class="section" v-if="collection.template">
  <div v-bind:class="{'is-active': visible}" class="modal">
    <div class="modal-background" @click="toggleForm"></div>
    <div class="modal-content">
      <form class="box">
        <div v-for="data in editTemplate.data" class="field">
          <label class="label" :for="data.name">{{data.prompt}}</label>
          <div class="control" v-model="data.value">
            <input class="input" name="" :type="data.type" :id="data.name" v-model="data.value">
          </div>
        </div>

        <div class="field has-text-centered">
          <button type="button" class="button" @click="createOrUpdate">Submit</button>
        </div>
      </form>
    </div>
    <button @click="toggleForm" class="modal-close is-large" aria-label="close"></button>
  </div>
</div>

</template>

<script>
// Module to make AJAX calls to API server
import axios from 'axios';

export default {
  name: 'TemplateForm',
  created: function() {
    this.buildTemplate();
  },
  // Component props https://vuejs.org/v2/guide/components.html#Props
  props: [
    'collection',
    'item',
    'visible'
  ],
  computed: {
    editTemplate: function () {
      if (this.item == null)
        return this.collection.template;
      
      var e = {};
      e.data = [];
      for (var field of this.collection.template.data) {
        for (var d of this.item.data) {
          if (d.name == field.name) {
            e.data.push(
              {
                name: field.name,
                prompt: field.prompt,
                value: d.value
              }
            )
          }
        }
      }
      return e;
    }
  },
  data: function() {
    return {
    }
  },
  components: {
  },
  methods: {
    toggleForm: function() {
      this.$emit('close');
    },
    createOrUpdate: function() {
      if (this.item) {
        // Update
        this.updateItem();
      } else {
        this.createItem();
      }
      
    },
    createItem: function() {
      // Method to do a POST request to create an item in a collection
	    // The POST request must be sent to the collection.href property of the collection object
	    // It must be called when the user clicks on the CREATE ITEM button
	    // It must send the TEMPLATE object of the collection with the data filled by the user
	    // http://amundsen.com/media-types/collection/examples/#ex-write
      
      // Post to the collection url, available in this.createurl
      // We send the 'template' prop, which is bound to the form
      axios.post(this.collection.href, {template: this.editTemplate})
        .then(function (response) {
          // Emit an event to read again the collection
          // The App component will listen to the 'refresh' event and it will call the readCollection method
          this.$emit('refresh', this.collection.href);
          this.toggleForm();
        }.bind(this))
        .catch(e => {
          // If error, display in console
          console.log(e);
        });
    },
    updateItem: function() {
      // Method to do a PUT request to update an item
	    // The PUT request must be sent to the item.href property
	    // It must be called when the user submits the update form
	    // It must send the TEMPLATE object of the collection with the data filled by the user
	    // http://amundsen.com/media-types/collection/examples/#ex-write
      
      axios.put(this.item.href, {template: this.editTemplate})
        .then(function (response) {
          // Emit an event to read again the collection
          // The App component will listen to the 'refresh' event and it will call the readCollection method
          this.$emit('refresh', this.item.href);
          this.toggleForm();
        }.bind(this))
        .catch(e => {
          // If error, display in console
          console.log(e);
        });
    },
    buildTemplate: function () {
    }
  }
}
</script>

<style scoped>

</style>
