<!-- App.vue -->

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <ul v-else-if="customers">
      <li v-for="customer of customers" :key="customer.id">
        {{ customer.id }} {{ customer.name }}
      </li>
    </ul>
    <!-- <button @click="funcGetAll">Select 버튼</button> -->
    <br/>
    <!-- <ul v-if="state">
      <li v-for="customer of state.customers" :key="customer.id">
        {{ customer.id }} {{ customer.name }}
      </li>
    </ul> -->
    <!-- {{ fetchPolicy }} -->
  </div>

  <div>
    <input v-model="id" placeholder="Enter ID">

      <button @click="funcDelete()" @keyup.enter="id = ''">
      <!-- <button @click="DeleteCustomer()"> -->
        Delete 버튼
      </button>
  </div>
</template>

<script>
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { watch, computed, ref, onMounted, onUpdated } from 'vue'

const GET_DATA_QUERY = gql`
      query GetCustomers {
              getCustomers {
                  age
                  email
                  id
                  name
              }
        }
    `;

export default {
  props: ['id'],
  setup(props) {
    // const state = ref({
    //   customers: []
    // });

    const id = ref('');

    const { mutate: DeleteCustomer, onDone } = useMutation(gql`
        mutation DeleteCustomer($id: ID!) {
          deleteCustomer(id: $id)
        }
    `, () => ({
      variables: {
        id: id.value,
      },
      update: (cache, { data: { DeleteCustomer } }) => {
        let data = cache.readQuery({ query: GET_DATA_QUERY })
        console.log('--jsdno0 debug update')
        console.log(data)
        // data = {
        //   ...data,
        //   getCustomers: [
        //     ...data.getCustomers,
        //     DeleteCustomer,
        //   ],
        // }
        // cache.writeQuery({ query: GET_DATA_QUERY, data })
      },
    }))

    const { result, loading, error, refetch, onResult } = useQuery(gql`
      query GetCustomers {
              getCustomers {
                  age
                  email
                  id
                  name
              }
        }`
       , () => ({
          // id: id.value
          // id: props.id
        })
        , () => ({
          fetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
      )

    watch(result, value => {
      console.log('--jsdno0 debug watch: ')
      console.log(result)
      console.log(value)
    })
    
    onResult(result => {
      console.log('--jsdno0 debug onResult: ')
      console.log(result)
    })

    onDone(result => {
      console.log('--jsdno0 debug onDone: ')
      console.log(result)
    })

    onUpdated(() => {
      console.log('onUpdated')
    })

    onMounted(() => {
      console.log('onMounted')
    });

    let customers = computed(() => result.value?.getCustomers ?? [])
    
    // const funcGetAll = () => {
    //   console.log('funcGetAll')
    //   state.value.customers = computed(() => result.value?.getCustomers ?? [])
    //   customers = computed(() => result.value?.getCustomers ?? [])
    //   console.log(state.value.customers)
    // }

    const funcDelete = async () => {
      await DeleteCustomer(id.value)
      await refetch()
    }

    

    return {
      // state,
      customers,
      loading,
      error,
      // funcGetAll,
      refetch,
      onResult,
      onDone,
      id,
      funcDelete,
      DeleteCustomer
    }
  },
};
</script>
