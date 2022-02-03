<template>

  <form class="box" @submit="createOrUpdate($event)">
    <div v-for="data in editTemplate.data" class="field">
      <label v-if="(data.type!='checkbox') && (data.type!='radio')" class="label" :for="data.name">{{data.prompt}}</label>
      <div class="control">
        <div v-if="data.type.indexOf('select') > -1" :class="{ select: true, 'is-multiple': data.type=='select-multiple' }">
          <select :multiple="data.type=='select-multiple'" name="" :id="data.name" v-model="data.value" :required="data.required">
            <option v-for="op in collection.related[data.suggest.related]" :value="op[data.suggest.value]">
              {{op[data.suggest.text]}}
            </option>
          </select>
        </div>
        <textarea v-else-if="data.type == 'textarea'" class="input" :name="data.name" :type="data.type" :id="data.name" v-model="data.value" :required="data.required">
        </textarea>
        <div v-else-if="data.type == 'notification'" v-html="data.value" class="notification is-info" :name="data.name" :id="data.name">
        </div>
        <!-- <FileComponent v-else-if="data.type == 'file'" :data="data"></FileComponent> -->
        <div v-else-if="data.type.indexOf('file') > -1" class="file">
          <label class="file-label">
            <input class="file-input" type="file" :name="data.name" :id="data.name" :multiple="data.type == 'file-multiple'" @change="updateFile($event, data)" :required="data.required">
            <span class="file-cta">
              <span class="file-icon">
                <i class="ion-upload"></i>
              </span>
              <span class="file-label">
                Elija un archivo
              </span>
            </span>
          </label>
        </div>
        <input v-else-if="data.type == 'number'" class="input" :name="data.name" :type="data.type" :id="data.name" v-model.number="data.value" :required="data.required" :step="data.step" :pattern="data.match">
        <label v-else-if="(data.type == 'checkbox') || (data.type == 'radio')" :class="data.type">
          <input :type="data.type">
          {{data.prompt}}
        </label>
        <input v-else class="input" :name="data.name" :type="data.type" :id="data.name" v-model="data.value" :required="data.required" :step="data.step" :pattern="data.match">
      </div>
    </div>

    <div class="field has-text-centered">
      <input type="submit" class="button is-primary"></input>
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
        var f = {
          name: field.name,
          prompt: field.prompt,
          type: field.type,
          value: '',
          required: field.required,
          step: field.step,
          match: field.match,
          suggest: field.suggest
        }
        for (var d of this.item.data) {
          if (d.name == field.name) {
            f.value = d.value;
            break;
          }
        }
        e.data.push(f);
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
    updateFile: function(e, data) {
      // Store in data.value the file list of the input='file'
      data.value = e.target.files;
    },
    createOrUpdate: function(e) {
      e.preventDefault();
      if (this.item) {
        // Update
        this.updateItem();
      } else {
        this.createItem();
      }

    },
    buildSendData: function() {
      // Add support for attachments
      // https://github.com/collection-json/extensions/pull/7

      // Default: send data in CJ format
      var dataToSend = {template: this.editTemplate};

      if ( (this.collection.template.contentType) && (this.collection.template.contentType == "multipart/form-data") ) {
        // If template.contentType exists and is 'multipart/form-data', send the data in Form-Data format. Also, include attachments
        var form_data = new FormData();

        // Transform CJ template to FormData
        for ( var key of this.editTemplate.data) {
          // Check if file component has more than one file selected
          if (key.value instanceof FileList) {
            for (var i of key.value) {
              form_data.append(key.name, i);
            }
          } else {
            form_data.append(key.name, key.value);
          }
        }
        dataToSend = form_data;
      };

      return dataToSend;
    },
    createItem: function() {
      // Method to do a POST request to create an item in a collection
	    // The POST request must be sent to the collection.href property of the collection object
	    // It must be called when the user clicks on the CREATE ITEM button
	    // It must send the TEMPLATE object of the collection with the data filled by the user
	    // http://amundsen.com/media-types/collection/examples/#ex-write

      // Post to the collection url, available in this.createurl
      // We send the 'template' prop, which is bound to the form
      axios.post(this.collection.href, this.buildSendData())
           .then(function (response) {
             // Emit an event to read again the collection
             // The App component will listen to the 'refresh' event and it will call the readCollection method
             // this.$emit('refresh', this.collection.href);
             this.$emit('refresh', response.headers.location);
             this.$emit('showMessage', "Elemento creado con éxito");
           }.bind(this))
           .catch(e => {
             // If error, display in console
             // this.$emit('showMessage', "Ocurrió un error al crear el elemento");
             this.$emit('showMessage', e.response.data.collection.error.message);
             console.log(e.response.data.collection.error.message);
           });
    },
    updateItem: function() {
      // Method to do a PUT request to update an item
	    // The PUT request must be sent to the item.href property
	    // It must be called when the user submits the update form
	    // It must send the TEMPLATE object of the collection with the data filled by the user
	    // http://amundsen.com/media-types/collection/examples/#ex-write

      axios.put(this.item.href, this.buildSendData())
           .then(function (response) {
             // Emit an event to read again the collection
             // The App component will listen to the 'refresh' event and it will call the readCollection method
             this.$emit('refresh', response.headers.location || this.item.href);
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
