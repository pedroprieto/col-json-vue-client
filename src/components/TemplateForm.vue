<template>

<!-- This component will build a web form to display the collection.template available in the 'template' prop. This form will be bound to the 'template' prop. When the form is submitted, the method 'createItem' will be called to send the data to the server and create a new item. -->

<!-- How to bind form inputs to data: https://vuejs.org/v2/guide/forms.html -->

<!-- Listening to events: https://vuejs.org/v2/guide/events.html -->

<div>
  <div v-bind:class="{'is-active': visible}" class="modal">
    <div class="modal-background" @click="toggleForm"></div>
    <div class="modal-content">
      <TemplateData @refresh="refresh" :collection="collection" :item="item"></TemplateData>
    </div>
    <button @click="toggleForm" class="modal-close is-large" aria-label="close"></button>
  </div>
</div>

</template>

<script>
// Module to make AJAX calls to API server
import axios from 'axios';
import TemplateData from './TemplateData';

export default {
  name: 'TemplateForm',
  props: [
    'collection',
    'item',
    'visible'
  ],
  components: {
    TemplateData
  },
  methods: {
    toggleForm: function() {
      this.$emit('close');
    },
    refresh: function(url) {
      this.toggleForm();
      this.$emit('refresh', url);
    },
  }
}
</script>

<style scoped>

</style>
