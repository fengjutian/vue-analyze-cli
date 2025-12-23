<template>
  <div class="test-container">
    <h1>{{ pageTitle }}</h1>
    
    <div v-if="showContent">
      <p>This is a test content area</p>
      <button @click="handleClick">Click Me</button>
    </div>
    
    <div v-else>
      <p>No content to display</p>
    </div>
    
    <ul>
      <li v-for="item in items" :key="item.id" :class="{ active: item.isActive }">
        {{ item.name }}
      </li>
    </ul>
    
    <CustomComponent :prop1="value" @custom-event="handleCustomEvent">
      <template #header>
        <h2>Custom Header</h2>
      </template>
    </CustomComponent>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageTitle: 'Test Page',
      showContent: true,
      value: 'test value',
      items: [
        { id: 1, name: 'Item 1', isActive: true },
        { id: 2, name: 'Item 2', isActive: false },
        { id: 3, name: 'Item 3', isActive: true }
      ]
    }
  },
  methods: {
    handleClick() {
      this.showContent = !this.showContent
    },
    handleCustomEvent() {
      console.log('Custom event triggered')
    }
  }
}
</script>

<style scoped>
.test-container {
  padding: 20px;
}
</style>