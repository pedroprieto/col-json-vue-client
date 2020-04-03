<template>
  <div>

    <nav v-if="linkGroups.mainNav" class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="/assets/logo.png" alt="Client Logo" width="100%" >
        </a>

        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item" v-for="link in linkGroups.mainNav" :href="link.href" @click="processLink(link,$event)">{{link.prompt}}</a>
        </div>
      </div>
    </nav>

    <!-- Collection Title -->
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{title}}
          </h1>
          <h2 v-if="message" class="subtitle" v-html="message">
          </h2>
          <div class="level-left">
            <a class="level-item button" v-for="link in linkGroups.secondaryNav" :href="link.href" @click="processLink(link,$event)">{{link.prompt}}</a>
            <a class="level-item button" v-for="link in linkGroups.upNav" :href="link.href" @click="processLink(link,$event)">
              {{link.prompt}}
            </a>
          </div>
        </div>
      </div>
    </section>



    <!-- Pagination -->
    <nav v-if="linkGroups.prev || linkGroups.next" class="pagination level" role="navigation" aria-label="pagination">
      <a v-if="linkGroups.prev" @click="processLink(linkGroups.prev,$event)" class="pagination-previous">{{linkGroups.prev.prompt}}</a>
      <a v-if="linkGroups.next" @click="processLink(linkGroups.next,$event)" class="pagination-next">{{linkGroups.next.prompt}}</a>
    </nav>

  </div>

</template>

<script>

export default {
  name: 'CollectionLinks',
  /* https://vuejs.org/v2/guide/components.html#Dynamic-Props*/
  props: [
    // This prop stores the collection.links array
    'links',
    'message',
    'title'
  ],
  data: function() {
    return {
    }
  },
  computed: {
    linkGroups: function() {
      return this.links.reduce(function (res, el) {
        if ( el.rel.includes('current')) {
          res.current= el;
        } else if (el.rel.includes('prev')) {
          res.prev = el;
        } else if (el.rel.includes('next')) {
          res.next = el;
        } else if (el.rel.includes('secondary')) {
          res.secondaryNav.push(el);
        } else if (el.rel.includes('up')) {
          res.upNav.push(el);
        } else {
          // Main nav link
          res.mainNav.push(el);
        }
        return res;
      }, {current: null, prev: null, next: null, mainNav: [], secondaryNav: [], upNav: []});

    }
  },
  components: {
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
    }
  }
}
</script>

<style scoped>

</style>
