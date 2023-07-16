<script>
import { computed, onMounted, onUpdated, ref, reactive } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import ApolloDataMutationAdd from './ApolloDataMutationAdd.vue';

export default {
  name: 'ApolloData',
  components: {
    ApolloDataMutationAdd
  },
  setup () {
    // const customersRef = ref([]);
    // const customersReactive = reactive([]);
    const state = reactive({
      customers: []
    });

    const GET_ALL_QUERY = gql`
      query GetCustomers {
              getCustomers {
                  age
                  email
                  id
                  name
              }
        }
    `;

    const DELETE_QUERY = gql`
        mutation DeleteCustomer($id: ID!) {
          deleteCustomer(id: $id)
        }
    `

    const getAll = useQuery(GET_ALL_QUERY);

    const { mutate: DeleteCustomer, loading, error } = useMutation(DELETE_QUERY);

    onUpdated(() => {
      // console.log("state의 변화가 있을 때마다 updated", state.customers)
      console.log('jsdno0 debug2-2 onUpdated')
    })

    onMounted(() => {
      // onMounted 될때마다 실행하기 때문에 좋은 코드는 아니지만, 본 기초영상에서만 다음과 같이 코딩
      if (getAll && getAll !== null && getAll !== undefined){
        getAll.onResult((res) => {
          if (res.data?.getCustomers) {
            console.log('res: ', res.data.getCustomers);
            // state.customers.push(...res.data.getCustomers);
            state.customers = [
              ...res.data.getCustomers              
            ]
          }
        })
      }
      console.log('jsdno0 debug2-1 onMounted')
    })

    const funcAdd = (val) => {
      // const refList = customersRef.value;
      // refList.push(val);
      // customersRef.value = refList;

      state.customers.push(val);
    }


    const deleteCustomer = async (id) => {
      try {
        await DeleteCustomer({ id: id });
        alert('delete completed: ', id)
        state.customers = state.customers.filter(todo => id !== todo.id);
      } catch (error) {
        console.error('Error deleting customer:', error.message);
      }
    };

    return {
        // customersRef,
        // customersReactive,
        state,
        onMounted,
        onUpdated,
        funcAdd,
        deleteCustomer,
        // DeleteCustomer
    }
  },
}
</script>

<template>
  <div class="container-md">

    <div v-if="loading" class="alert alert-info">Loading...</div>

    <div v-else-if="error" class="alert alert-danger">Error: {{ error.message }}</div>

    <!-- <ul v-else-if="customersRef" class="list-group">
      <li v-for="customer of customersRef" :key="customer.id" class="list-group-item">
        {{ customer.id }} / {{ customer.name }} / {{ customer.email }}  / {{ customer.age }}
      </li>
    </ul> -->

    <div class="row">
      <div class="col" v-if="state.customers">
        <h2>Customers<span class="badge text-bg-danger" style="font-size: 8px;">delete</span></h2>
        <ul class="list-group">
          <li v-for="customer of state.customers" :key="customer.id" class="list-group-item list-group-item-action text-start">
            id: {{ customer.id }} | name: {{ customer.name }} | email: {{ customer.email }} | age: {{ customer.age }}
            <button class="badge bg-danger rounded-pill" @click="deleteCustomer(customer.id)">
              X
            </button>
          </li>
        </ul>
      </div>
      
      <div class="col">
        <ApolloDataMutationAdd 
        @funcAdd="funcAdd"
        />
      </div>
    </div>

    <div class="row">
      <div class="col">
        
      </div>
    </div>
  </div>
</template>