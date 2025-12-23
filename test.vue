<template>
  <div class="container">
    <h1>{{ title }}</h1>
    
    <div v-for="item in items" :key="item.id" class="item">
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
      
      <button @click="handleClick(item.id)" :disabled="!item.enabled">
        {{ item.enabled ? 'Active' : 'Inactive' }}
      </button>
      
      <div v-if="item.isAdmin">
        <AdminPanel />
      </div>
      <div v-else-if="item.isModerator">
        <ModeratorPanel />
      </div>
      <div v-else>
        <UserPanel />
      </div>
      
      <input v-model="searchTerm" placeholder="Search..." />
      <input v-model:value="searchTerm" placeholder="Search..." />
      
      <slot name="custom-content"></slot>
      <slot></slot>
      
      <div v-custom-directive="value"></div>
      <div v-another-directive></div>
    </div>
  </div>
</template>

<script>
import AdminPanel from './components/AdminPanel.vue'
import ModeratorPanel from './components/ModeratorPanel.vue'
import UserPanel from './components/UserPanel.vue'

export default {
  name: 'TestComponent',
  components: {
    AdminPanel,
    ModeratorPanel,
    UserPanel
  },
  data() {
    return {
      title: 'Test Component',
      items: [
        { id: 1, title: 'Item 1', description: 'Description 1', enabled: true, isAdmin: true },
        { id: 2, title: 'Item 2', description: 'Description 2', enabled: false, isModerator: true },
        { id: 3, title: 'Item 3', description: 'Description 3', enabled: true }
      ],
      searchTerm: ''
    }
  },
  methods: {
    handleClick(id) {
      console.log('Clicked item:', id)
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.item {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>