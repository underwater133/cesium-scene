<template>
  <div class="item-list">
    <div v-for="(item, index) in items" 
         :key="index" 
         class="item"
         @click="item.path ? navigate(item.path) : null">
      <div class="cover">
        <img :src="item.cover" :alt="item.title" />
      </div>
      <h3>{{ item.title + index }}</h3>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vitepress'

const router = useRouter()
const items = [
  {
    title: '组件1',
    cover: '/public/images/1.png',
    path: '/scene/test'
  },
  {
    title: '组件2',
    cover: '/public/images/1.png'
  },
  {
    title: '组件3',
    cover: '/public/images/1.png'
  },
  {
    title: '组件2',
    cover: '/public/images/1.png'
  },
  {
    title: '组件3',
    cover: '/public/images/1.png'
  },
  {
    title: '组件2',
    cover: '/public/images/1.png'
  },
  {
    title: '组件3',
    cover: '/public/images/1.png'
  }
]

const navigate = (path) => {  
  router.go(path)
}
</script>

<style scoped>
.item-list {
  margin: 0;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 16px;
}

.item {
  width: 360px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  transition: all 0.25s;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.item:hover {
  background: var(--vp-c-bg-soft-up);
  transform: translateY(-4px);
}

.cover {
  width: 100%;
  height: 200px;
  margin-bottom: 16px;
  border-radius: 4px;
  overflow: hidden;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
}
</style>
