<template>
  <div>
    <h2>Update Customer</h2>
    <form @submit.prevent="updateCustomer" class="mb-3">
      <div class="mb-3">
        <input v-model="updatedCustomer.name" class="form-control" placeholder="Name" required>
      </div>
      <div class="mb-3">
        <input v-model="updatedCustomer.email" class="form-control" placeholder="Email" required>
      </div>
      <div class="mb-3">
        <input v-model.number="updatedCustomer.age" type="number" class="form-control" placeholder="Age" required>
      </div>
      <button type="submit" class="btn btn-primary">Update</button>
    </form>
    <div v-if="loading" class="alert alert-info">Updating...</div>
    <div v-if="error" class="alert alert-danger">Error: {{ error.message }}</div>
    <div v-if="result.value" class="alert alert-success">
      <p>Updated Customer:</p>
      <p>ID: {{ result.value.updateCustomer.id }}</p>
      <p>Name: {{ result.value.updateCustomer.name }}</p>
      <p>Email: {{ result.value.updateCustomer.email }}</p>
      <p>Age: {{ result.value.updateCustomer.age }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onUpdated, onUpdated } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';

export default {
  name: 'ApolloDataMutationUpdate',
  props: {
        customers: Array
  },
  setup(props, {emit}) {
    const state = ref({
      customers: {
        name: props.customers.name,
        email: props.customers.email,
        age: props.customers.age,
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
        const { data } = await UpdateCustomer({
          id: state.customers.value.id,
          name: state.customers.value.name,
          email: state.customers.value.email,
          age: state.customers.value.age,
        });
        console.log('Customer updated:', data.customers);
        
        emit('funcUpdate', val);
      } catch (error) {
        console.error('Error updating customer:', error.message);
      }
    };

    onUpdated(()=>{
      // console.log("Add 페이지 state의 변화가 있을 때마다 updated", newCustomer)
    })

    onMounted(()=>{
      // console.log("Add 페이지 새로 시작할때마다 mounted", newCustomer)
    })

    return {
      state,
      updateCustomer,
      // UpdateCustomer,
      loading,
      error,
      result,
      onUpdated,
      onMounted
    };
  },
  emits: [
    'funcUpdate'
  ]
};
</script>

<style lang="scss" scoped>

</style>
