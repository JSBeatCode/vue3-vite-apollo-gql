<!-- App.vue -->

<script>
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { watch, computed, ref, onMounted, onUpdated } from 'vue'

// const GET_DATA_QUERY =gql`
//       query GetCustomers {
//               getCustomers {
//                   age
//                   email
//                   id
//                   name
//               }
//         }
//     `;

export default {
  setup() {
    const fetchPolicy = ref('network-only')
    const state = ref({
      customers: []
    })
    const { result, loading, error } = useQuery(gql`
      query GetCustomers {
              getCustomers {
                  age
                  email
                  id
                  name
              }
        }`
        , null
        , () => ({
          fetchPolicy: fetchPolicy.value
        })
      )

    watch(result, value => {
      console.log(value)
      console.log(result.value.getCustomers)
    })

    onUpdated(() => {
      console.log('onUpdated')
    })

    onMounted(() => {
      console.log('onMounted')
    });

    let customers = computed(() => result.value?.getCustomers ?? [])
    
    const funcGetAll = () => {
      console.log('funcGetAll')
      state.value.customers = computed(() => result.value?.getCustomers ?? [])
      console.log(state.value.customers)
    }

    

    return {
      state,
      customers,
      loading,
      error,
      funcGetAll,
      fetchPolicy
    }
  },
};
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <ul v-else-if="customers">
      <li v-for="customer of customers" :key="customer.id">
        {{ customer.id }} {{ customer.name }}
      </li>
    </ul>
    <button @click="funcGetAll">버튼</button>
    <br/>
    <ul v-if="state">
      <li v-for="customer of state.customers" :key="customer.id">
        {{ customer.id }} {{ customer.name }}
      </li>
    </ul>
    {{ fetchPolicy }}
  </div>
</template>
