<script>
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export default {
  setup () {
    const { result, loading, error } = useQuery(gql`
        query GetCustomers {
            getCustomers {
                age
                email
                id
                name
            }
        }
    `)

    const customers = computed(() => result.value?.users ?? [])

    return {
        customers,
        result,
        loading,
    }
  },
}
</script>

<template>
  <!-- <ul>
    <li v-for="user of customers" :key="user.id">
      {{ user.id }} {{ user.name }}
    </li>
  </ul> -->

  <div v-if="loading">Loading...</div>

  <div v-else-if="error">Error: {{ error.message }}</div>

    <ul v-else-if="result && result.getCustomers">
        <li v-for="user of result.getCustomers" :key="user.id">
            {{ user.id }} {{ user.name }}
        </li>
    </ul>

</template>