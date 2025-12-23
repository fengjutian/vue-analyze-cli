<template>
  <div class="app">
    <h1>{{ title }}</h1>
    
    <div v-if="showMessage">
      <p>{{ message }}</p>
    </div>
    <div v-else-if="showWarning">
      <p class="warning">{{ warning }}</p>
    </div>
    <div v-else>
      <p>Nothing to show</p>
    </div>
    
    <ul>
      <li v-for="item in items" :key="item.id" @click="handleClick(item)">
        {{ item.name }}
      </li>
    </ul>
    
    <CustomComponent :prop1="value" @event="handleEvent" />
    <slot name="footer"></slot>
  </div>
</template>

<script>
import CustomComponent from './CustomComponent.vue'

export default {
  components: {
    CustomComponent
  },
  data() {
    return {
      title: 'Vue Test App',
      message: 'Hello World',
      warning: 'Warning message',
      showMessage: true,
      showWarning: false,
      value: 'test',
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ]
    }
  },
  methods: {
    handleClick(item) {
      console.log('Clicked:', item)
    },
    handleEvent() {
      console.log('Event triggered')
    }
  }
}
</script>

<style>
.app {
  padding: 20px;
}

.warning {
  color: red;
}
</style>