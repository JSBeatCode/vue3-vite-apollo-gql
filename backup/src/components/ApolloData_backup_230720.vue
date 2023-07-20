
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
            <!-- <button class="badge bg-success rounded-pill" @click="funcUpdateStart(customer.id)">
              Update
            </button> -->
            <!-- <button class="badge bg-danger rounded-pill" @click="funcDeleteCustomer(customer.id)">
              Delete
            </button> -->
            
          </li>
        </ul>
      </div>
      <div>
        <div>
          <button @click="funcGetAll">데이터 가져오기</button>
          <div v-if="loading">로딩 중...</div>
          <div v-else-if="error">{{ error.message }}</div>
          <div v-else>
            <ul v-if="data">
              <li v-for="item in data" :key="item.id">{{ item.name }}</li>
            </ul>
          </div>
        </div> 
      </div>
      
      <div class="col">
        <!-- <ApolloDataAdd 
          @funcAdd="funcAdd"
        /> -->
      </div>
    </div>

    <div class="row">
      <div class="col">

      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUpdated, ref, reactive } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import ApolloDataAdd from './ApolloDataAdd.vue';
// import ApolloDataMutationUpdate from './ApolloDataMutationUpdate.vue';

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
    const GET_ONE_QUERY= gql`
      query GetCustomer($id: ID!) {
        getCustomer(id: $id) {
          id
          email
        }
      }
    `;

    const ADD_QUERY = gql`
      mutation AddCustomer($name: String!, $email: String!, $age: Int!) {
        addCustomer(name: $name, email: $email, age: $age) {
          id
          name
          email
          age
        }
      }
    `;

export default {
  name: 'ApolloData',
  components: {
    ApolloDataAdd,
    // ApolloDataMutationUpdate
  },
  setup () {
    // const customersRef = ref([]);
    // const customersReactive = reactive([]);
    const state = ref({
      customers: [],
      customer: {},
      firstUp: true
    });



    // const getOneResult = useQuery(GET_ONE_QUERY, { id: state.customer.id });
    const { loading, error, data, refetch } = useQuery(GET_ALL_QUERY, {
      onResult(result) {
        state.value.customers = result.data
      }
    });
    // const getAll  = useQuery(GET_ALL_QUERY);

    // const { mutate: DeleteCustomer, delLoading, delErr } = useMutation(DELETE_QUERY);

    // const { mutate: AddCustomer, addErr } = useMutation(ADD_QUERY);

    onUpdated(() => {
      console.log("state의 변화가 있을 때마다 updated")
      if (state.value.firstUp !== true) {
        funcGetAll('onUpdated');
      } else {
        state.value.firstUp = false;
      }
    })

    onMounted(() => {
      // onMounted 될때마다 실행하기 때문에 좋은 코드는 아니지만, 본 기초영상에서만 다음과 같이 코딩
      funcGetAll('onMounted');
    })

    

    // const funcGetOne = () => {
    //   if (getOneResult && getOneResult !== null && getOneResult !== undefined) {
    //     getOneResult.onResult((res) =>{
    //       if (res.data?.getCustomer) {
    //         console.log('res: ', res.data.getCustomer);
    //         state.customer = res.data.getCustomer;
    //       }
    //     })
    //   }
    // }

    const funcGetAll = (caller) => {
      console.log('caller::', caller);
      refetch();
      // console.log(data);
      // const res = await GetCustomers();
      // console.log('res::', res);
      // useQuery(GET_ALL_QUERY).onResult(res => {
      //   if (res?.data?.getCustomers) {
      //     state.customers = res.data?.getCustomers;
      //   }
      // })
      // const getAll = useQuery(GET_ALL_QUERY);
      // if (getAll && getAll !== null && getAll !== undefined){
      //   // const getAllRes = getAll.
      //   // console.log('getAllRes::')
      //   // if (getAllRes?.value?.getCustomers) {
      //   //   console.log(getAllRes.value.getCustomers)
      //   //   state.customers = getAllRes.value.getCustomers;
      //   // }
      //   getAll.onResult((res) => {
      //     if (res.data?.getCustomers) {
      //       console.log('res: ', res.data.getCustomers);
      //       // state.customers.push(...res.data.getCustomers);
      //       state.customers = res.data.getCustomers;
      //     }
      //   })
      // }
    }

    // const funcAdd = async (val) => {
    //   // const refList = customersRef.value;
    //   // refList.push(val);
    //   // customersRef.value = refList;

    //   // state.customers.push(val);
    //   try {
    //     const { data } = await AddCustomer({
    //       name: state.customer.name,
    //       email: state.customer.email,
    //       age: state.customer.age,
    //     });

    //     console.log('Customer added:', data.addCustomer);
    //     // 추가된 고객을 처리하는 로직 추가
    //     state.customer = {};
    //   } catch (error) {
    //     console.error('Error adding customer:', error.message);
    //   }
    //   // await funcGetAll();
    // }

    // const funcUpdate = (val) => {
    //   console.log('jsdno0 debug1-2 emit funcUpdate', val)
    //   funcGetAll();
    //   state.customer = {};
    // }

    // const funcUpdateStart = (id) => {
    //   const one = state.customers.filter(one => one.id === id);
    //   console.log('jsdno0 debug3-1', one[0])
    //   state.customer = one[0];
    // }


    // const funcDeleteCustomer = async (delId) => {
    //   try {
    //     // const { mutate: DeleteCustomer, delLoading, delErr } = useMutation(DELETE_QUERY);

    //     await DeleteCustomer({id: delId})
    //     await funcGetAll('funcDeleteCustomer');
    //     // state.customers = state.customers.filter(one => id !== one.id);
    //     // if(state.customer && state.customer.id){
    //     //   console.log('customer exists', state.customer)
    //     //   console.log(state.customer.id, id, state.customer.id===id)
    //     //   if (state.customer.id === id) {
    //     //     console.log('id is identical')
    //     //     state.customer = {};
    //     //   }
    //     // }
    //     // alert('delete completed: ', id)
    //   } catch (error) {
    //     console.error('Error deleting customer:', error.message);
    //   }
    // };

    return {
        state,
        onMounted,
        onUpdated,
        // funcGetOne,
        funcGetAll,
        data,
        loading,
        error
        // funcAdd,
        // funcUpdate,
        // funcUpdateStart,
        // funcDeleteCustomer,
    }
  },
}
</script>
