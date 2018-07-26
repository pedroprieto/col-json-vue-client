<template>
<div >
  <div class="box container" v-for="item in collection.items" >
    
    <div class="level">
      
      <!-- Action buttons -->
      <div v-if="!item.readOnly" class="level-left">
        <a v-if="collection.template && collection.template.type != 'post-only'" class="level-item button is-primary is-outlined is-small" @click="showEditForm(item,$event)">Editar</a>
        <a class="level-item button is-info is-outlined is-small" :href="item.href" @click="processLink(item,$event)">Visitar</a>
        <a class="level-item button is-danger is-outlined is-small" @click="deleteItem(item)">Borrar</a>
      </div>
      
      <!-- Item links -->
      <div class="level-right">
        <a v-for="link in item.links" class="level-item button is-outlined is-small" :href="link.href" @click="processLink(link,$event)">{{link.prompt}}</a>
      </div>
      
    </div>
    
    <!-- Item data -->
    
    
    <div class="columns">
      
      <div class="column" v-for="data in columnData(item.data)">
        <div class="prompt"><b>{{data.prompt}}</b></div>
        <div v-if="data.type=='date'" class="">{{new Date(data.value).toLocaleDateString()}}</div>
        <div v-else-if="data.type=='datetime'" class="">{{data.text}}</div>
        <div v-else-if="data.type=='select'" class="">{{data.text}}</div>
        <div v-else class="">{{data.value}}</div>
      </div>
      
    </div>
    
    <div class="columns">
         <div class="column" v-for="data in rowData(item.data)">
           <div class="prompt"><b>{{data.prompt}}</b></div>
           <div class="rowData">{{data.value}}</div>
         </div>
  </div>
    
  </div>
  
</div>

</template>

<script>
export default {
  name: 'CollectionItemsGeneric',
  props: [
    // This prop stores the collection object
    'collection'
  ],
  data: function() {
    return {
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    columnData: function(data) {
      return data.filter(function(el) {
        return el.type!='textarea';
      });
    },
    rowData: function(data) {
      return data.filter(function(el) {
        return el.type=='textarea';
      });
    },
    processLink: function(link, event) {
      // Prevent <a> element to load the url
      event.preventDefault();
      if (link.rel == 'external') {
        window.open(link.href, '_blank');
      } else {
        // Emit the event link-clicked. The App component will listen to it and it will call the readCollection function.
        this.$emit('link-clicked', link.href);
      }
    },
    showEditForm: function(item, event) {
      this.$emit('showEditForm', item, event);
    },
    deleteItem: function(item) {
      this.$emit('deleteItem', item);
    },
    // Function that runs to reload the item.url after an item update
    refresh: function(url) {
      console.log(url);
      console.log('refresh');
      this.$emit('refresh', url);
    }
  }
}
</script>

<style scoped>

.prompt{
    border-bottom: 1px dotted black;
}

.rowData{
    text-align: justify;
}

.box {
    box-shadow: 10px 10px 5px grey;
    border: 1px solid grey;
    }
</style>
