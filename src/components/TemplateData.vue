<template>

<form class="box">
  <div v-for="data in editTemplate.data" class="field">
    <label class="label" :for="data.name">{{data.prompt}}</label>
    <div class="control" v-model="data.value">
      <select v-if="data.type == 'select'" class="input" name="" :id="data.name" v-model="data.value">
        <option v-for="op in collection.related[data.suggest.related]" :value="op[data.suggest.value]">
          {{op[data.suggest.text]}}
        </option>
      </select>
      <textarea v-else-if="data.type == 'textarea'" class="input" name="data.name" :type="data.type" :id="data.name" v-model="data.value">
      </textarea>
      <div v-else-if="data.type == 'notification'" class="notification is-info" name="data.name" :id="data.name">
        {{data.value}}
      </div>
      <input v-else class="input" name="" :type="data.type" :id="data.name" v-model="data.value">
    </div>
  </div>
  
  <div class="field has-text-centered">
    <input type="submit" class="button" @click="createOrUpdate($event)"></input>
  </div>
</form>

</template>

<script>
// Module to make AJAX calls to API server
import axios from 'axios';

export default {
  name: 'TemplateData',
  created: function() {
  },
  props: [
    'collection',
    'item'
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
                value: d.value,
                type: field.type,
                suggest: field.suggest
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
    createOrUpdate: function(e) {
      e.preventDefault();
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
          // this.$emit('refresh', this.collection.href);
          this.$emit('refresh', response.headers.location);
          this.$emit('showMessage', "Elemento creado con éxito");
        }.bind(this))
        .catch(e => {
          // If error, display in console
          this.$emit('showMessage', "Ocurrió un error al crear el elemento");
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
          this.$emit('showMessage', "Elemento actualizado con éxito");
        }.bind(this))
        .catch(e => {
          // If error, display in console
          this.$emit('showMessage', "Ocurrió un error al actualizar el elemento");
          console.log(e);
        });
    }
  }
}
</script>

<style scoped>

</style>
