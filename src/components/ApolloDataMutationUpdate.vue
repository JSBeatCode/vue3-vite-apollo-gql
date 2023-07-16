<template>
  <div>
    <h2>Update Customer</h2>
    <!-- <form @submit.prevent="updateCustomer" class="mb-3"> -->
      <!-- <div class="mb-3">
        <input v-model="props.customer.id" class="form-control" placeholder="Id" required readonly>
      </div>
      <div class="mb-3">
        <input v-model="props.customer.name" class="form-control" placeholder="Name" required>
      </div>
      <div class="mb-3">
        <input v-model="props.customer.email" class="form-control" placeholder="Email" required>
      </div>
      <div class="mb-3">
        <input v-model.number="props.customer.age" type="number" class="form-control" placeholder="Age" required>
      </div> -->
      
      <div class="mb-3">
        <input 
        id="id" type="text" 
        v-model="state.customer.id" 
        class="form-control" placeholder="Id" required readonly>
      </div>
      <div class="mb-3">
        <input 
        id="name" type="text" 
        v-model="state.customer.name" 
        class="form-control" placeholder="Name" 
        required >
      </div>
      <div class="mb-3">
        <input id="email" type="text" 
        @change="funcOnChange" v-model="state.customer.email" class="form-control" placeholder="Email" required>
      </div>
      <div class="mb-3">
        <input id="age" type="number" @change="funcOnChange" v-model.number="state.customer.age" class="form-control" placeholder="Age" required >
      </div>
     
      <button type="submit" class="btn btn-primary" @click="updateCustomer">Update</button>
    <!-- </form> -->
    <div v-if="loading" class="alert alert-info">Updating...</div>
    <div v-if="error" class="alert alert-danger">Error: {{ error.message }}</div>
  </div>
</template>

<script>
import { ref, onUpdated, onMounted } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';

export default {
  name: 'ApolloDataMutationUpdate',
  props: {
        customer: Object
  },
  setup(props, {emit}) {
    const state = ref({
      // customer: {
      //   id: props.customer.id,
      //   name: props.customer.name,
      //   email: props.customer.email,
      //   age: props.customer.age,
      // }
      customer: {
        id: '',
        name: '',
        email: '',
        age: 0,
      }
    });

    // const customers = ref({
    //   name: props.customers.name,
    //   email: props.customers.email,
    //   age: props.customers.age,
    // });

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

    const { mutate: UpdateCustomer, loading, error, result } = useMutation(UPDATE_QUERY);

    const updateCustomer = async () => {
      try {
        // console.log('jsdno0 debug1-1')
        const { data } = await UpdateCustomer({
          id: state.value.customer.id,
          name: state.value.customer.name,
          email: state.value.customer.email,
          age: state.value.customer.age,
        });
        console.log('Customer updated:', data.customer);
        
        emit('funcUpdate', data.customer);

        state.value.customer.id = '';
        state.value.customer.name = '';
        state.value.customer.email = '';
        state.value.customer.age = '';

        // console.log('jsdno0 debug3-1 updateCustomer completed in Update.vue', state.value.customer)

      } catch (error) {
        console.error('Error updating customer:', error.message);
      }
    };

    const funcOnChange = () => {
      console.log('funcOnChange, ', e.target);
    }

    onUpdated(()=>{
      // console.log('jsdno0 debug4-1', props.customer.id)
      // console.log('jsdno0 debug4-2', state)
      // console.log("Add 페이지 state의 변화가 있을 때마다 updated")
      state.value.customer.id = props.customer.id;
      state.value.customer.name = props.customer.name;
      state.value.customer.email = props.customer.email;
      state.value.customer.age = props.customer.age;
    })

    onMounted(()=>{
      // console.log('jsdno0 debug4-2', props)
      // console.log("Add 페이지 새로 시작할때마다 mounted")
    })

    return {
      state,
      updateCustomer,
      // UpdateCustomer,
      loading,
      error,
      result,
      onUpdated,
      onMounted,
      funcOnChange
    };
  },
  emits: [
    'funcUpdate'
  ]
};
</script>

<style lang="scss" scoped>

</style>
