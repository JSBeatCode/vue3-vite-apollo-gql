<script>
import { computed, onMounted, onUpdated, ref, reactive } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import ApolloDataMutationAdd from './ApolloDataMutationAdd.vue';
import ApolloDataMutationUpdate from './ApolloDataMutationUpdate.vue';

export default {
  name: 'ApolloData',
  components: {
    ApolloDataMutationAdd,
    ApolloDataMutationUpdate
  },
  setup () {
    // const customersRef = ref([]);
    // const customersReactive = reactive([]);
    const state = reactive({
      customers: [],
      customer: {},
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
    })

    const funcAdd = (val) => {
      // const refList = customersRef.value;
      // refList.push(val);
      // customersRef.value = refList;

      state.customers.push(val);
    }

    const funcUpdate = (val) => {
      console.log('jsdno0 debug1-2 emit funcUpdate', val)
      state.customer = {};
    }

    const funcUpdateStart = (id) => {
      const one = state.customers.filter(one => one.id === id);
      console.log('jsdno0 debug3-1', one[0])
      state.customer = one[0];
    }


    const deleteCustomer = async (id) => {
      try {
        await DeleteCustomer({ id: id });
        alert('delete completed: ', id)
        state.customers = state.customers.filter(one => id !== one.id);
        if(state.customer && state.customer.id){
          console.log('customer exists', state.customer)
          console.log(state.customer.id, id, state.customer.id===id)
          if (state.customer.id === id) {
            console.log('id is identical')
            state.customer = {};
          }
        }
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
        funcUpdate,
        funcUpdateStart,
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
        <h2>
          Customers
          <span class="badge text-bg-success" style="font-size: 8px;">update</span>
          <span class="badge text-bg-danger" style="font-size: 8px;">delete</span>
        </h2>
        <ul class="list-group">
          <li v-for="customer of state.customers" :key="customer.id" class="list-group-item list-group-item-action text-start">
            id: {{ customer.id }} | name: {{ customer.name }} | email: {{ customer.email }} | age: {{ customer.age }}
            <button class="badge bg-success rounded-pill" @click="funcUpdateStart(customer.id)">
              U
            </button>
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
        <ApolloDataMutationUpdate 
          @funcUpdate="funcUpdate"
          :customer="state.customer"
        />
      </div>
    </div>
  </div>
</template>