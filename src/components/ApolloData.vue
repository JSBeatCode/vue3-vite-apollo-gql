
<template>
  <div class="container-md">

    <div v-if="getAllLoading" class="alert alert-info">Loading...</div>

    <div v-else-if="getAllError" class="alert alert-danger">Error: {{ getAllError.message }}</div>

    <div v-if="state.pageLoaded">page loaded</div>

    <div class="row">
      <div class="col">
        <h2>
          Customers
        </h2>
        <ul class="list-group">
          <li v-for="customer of state.customers" :key="customer.id" class="list-group-item list-group-item-action text-start">
            id: {{ customer.id }} | name: {{ customer.name }} | email: {{ customer.email }} | age: {{ customer.age }}
            <button class="badge bg-success rounded-pill" @click="funcSelectOneForSetting(customer.id)">
              Update
            </button>
            <button class="badge bg-danger rounded-pill" @click="funcDelete(customer.id)">
              Delete
            </button>
          </li>
        </ul>
      </div>

    </div>

    <div class="row">
      <div class="col">
        <ApolloDataUpdate 
          @funcUpdate="funcUpdate"
          @funcUpdateClear="funcUpdateClear"
          :customer="state.updCustomer"
        />
      </div>
      <div class="col">
        <ApolloDataAdd 
          @funcAdd="funcAdd"
          @funcAddClear="funcAddClear"
          :customer="state.addCustomer"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUpdated, ref, reactive, watch } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import ApolloDataAdd from './ApolloDataAdd.vue';
import ApolloDataUpdate from './ApolloDataUpdate.vue';

export default {
  name: 'ApolloData',
  components: {
    ApolloDataAdd,
    ApolloDataUpdate
  },
  setup () {
    // state 값 세팅
    const state = ref({
      customers: [],
      updCustomer: {},
      addCustomer: {}
    });

    // graphql crud 정의
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
    
    const GET_ONE_QUERY = gql`
      query GetCustomer($id: ID!) {
        getCustomer(id: $id) {
          id
          name
          email
          age
        }
      }
    `;

    const DELETE_QUERY = gql`
        mutation DeleteCustomer($id: ID!) {
          deleteCustomer(id: $id)
        }
    `;

    const UPDATE_QUERY = gql`
      mutation UpdateCustomer($id: ID!, $name: String, $email: String, $age: Int) {
        updateCustomer(id: $id, name: $name, email: $email, age: $age) {
          id
          name
          email
          age
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

    //vue apollo 수행
    //add
    const { mutate: AddCustomer, onError: addOnError, onDone: addOnDone } = useMutation(ADD_QUERY);

    //update
    const { mutate: UpdateCustomer, onError: updOnError, onDone: updOnDone } = useMutation(UPDATE_QUERY);

    //delete
    const { mutate: DeleteCustomer, onError: delOnError, onDone: delOnDone } = useMutation(DELETE_QUERY);

    //get all
    const { result: getAllRes, loading: getAllLoading, error: getAllError, refetch: getAllRefetch, onResult: getAllOnResult  } = useQuery(GET_ALL_QUERY);

    //get one
    const { result: getOneRes, refetch: getOneRefetch, onResult: getOneOnResult } = useQuery(GET_ONE_QUERY, () => ({ id: state.value.updCustomer.id ?? 0 }));

    // 페이지 시작할때 데이터 가져옴
    state.value.customers = computed(() => getAllRes.value?.getCustomers ?? [])

    //select 결과값 watch모드
    watch(getAllRes, value => {
      console.log('--jsdno0 debug watch', new Date().getTime())
    })

    // select 완료 후에 실행
    getAllOnResult(result => {
      console.log('--jsdno0 debug getAllOnResult', new Date().getTime())
      console.log(result)
    })

    // select one 완료 후에 실행
    getOneOnResult(result => {
      console.log('--jsdno0 debug getOneOnResult', new Date().getTime())
      console.log(result)
      if (result?.data?.getCustomer) {
        state.value.updCustomer = {
          id: result.data.getCustomer.id,
          name: result.data.getCustomer.name,
          email: result.data.getCustomer.email,
          age: result.data.getCustomer.age
        }
      }
    })

    // add 완료 후에 실행
    addOnDone(result => {
      console.log('--jsdno0 debug addOnDone', new Date().getTime())
      console.log(result)
      getAllRefetch();
    })

    // add 에러시 실행
    addOnError(result => {
      alert(result.message)
    })

    // update 에러시 실행
    updOnError(result => {
      alert(result.message)
    })

    // delete 에러시 실행
    delOnError(result => {
      alert(result.message)
    })

    // delete 완료 후에 실행
    delOnDone(result => {
      console.log('--jsdno0 debug delOnDone', new Date().getTime())
      console.log(result)
      getAllRefetch();
    })

    //update 완료 후에 실행
    updOnDone(result => {
      console.log('--jsdno0 debug updOnDone', new Date().getTime())
      console.log(result)
      getOneRefetch();
    })


    //vue lifecycle state 값 update 후
    onUpdated(() => {
      console.log('--jsdno0 debug onUpdated', new Date().getTime())
    })

    //vue lifecycle 페이지 마운트 후
    onMounted(() => {
      console.log('--jsdno0 debug onMounted', new Date().getTime())
    })

    //add 버튼 클릭
    const funcAdd = () => {
      console.log('--jsdno0 debug funcAdd')
      console.log(state.value.addCustomer)
      AddCustomer({
        name: state.value.addCustomer.name,
        email: state.value.addCustomer.email,
        age: state.value.addCustomer.age
      })
    }

    // add clear 버튼 클릭
    const funcAddClear = () => {
      state.value.addCustomer = {}
    }
 
    //update 버튼 클릭
    const funcUpdate = () => {
      console.log('--jsdno0 debug funcUpdate')
      console.log(state.value.updCustomer)
        UpdateCustomer({
            id: state.value.updCustomer.id,
            name: state.value.updCustomer.name,
            email: state.value.updCustomer.email,
            age: state.value.updCustomer.age
        })
    }

    // update input clear
    const funcUpdateClear = () => {
      state.value.updCustomer = {}
    }

    //update할 customer 한개를 불러옴 
    const funcSelectOneForSetting = (id) => {
      console.log('--jsdno0 debug funcSetUpdate', new Date().getTime())
      // update할 데이터 가져옴
      state.value.updCustomer.id = id;
      console.log(id)
      getOneRefetch();
      console.log('--jsdno0 debug getOneRefetch', new Date().getTime())
      console.log(getOneRes.value)

    }


    //delete 버튼 클릭
    const funcDelete = async (delId) => {
      console.log('--jsdno0 debug funcDelete')
      console.log(delId)
      DeleteCustomer({ id: delId });
      alert('delete completed')
    };

    return {
        state,
        onMounted,
        onUpdated,
        funcAdd,
        funcAddClear,
        funcUpdate,
        funcUpdateClear,
        funcSelectOneForSetting,
        funcDelete,
        // funcGetAll,
        getOneRefetch,
        getOneOnResult,
        getAllRefetch,
        getAllOnResult,
        delOnDone,
        addOnDone,
        updOnDone,
        addOnError,
        updOnError,
        delOnError,
        getAllLoading,
        getAllError
    }
  },
}
</script>
