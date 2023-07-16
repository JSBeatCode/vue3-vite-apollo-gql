<template>
  <div>
    <h2>Update Customer</h2>
    <form @submit.prevent="updateCustomer">
      <input v-model="updatedCustomer.name" placeholder="Name" required>
      <input v-model="updatedCustomer.email" placeholder="Email" required>
      <input v-model.number="updatedCustomer.age" type="number" placeholder="Age" required>
      <button type="submit">Update</button>
    </form>
    <div v-if="loading">Updating...</div>
    <div v-if="error">Error: {{ error.message }}</div>
    <div v-if="result.value">
      <p>Updated Customer:</p>
      <p>ID: {{ result.value.updateCustomer.id }}</p>
      <p>Name: {{ result.value.updateCustomer.name }}</p>
      <p>Email: {{ result.value.updateCustomer.email }}</p>
      <p>Age: {{ result.value.updateCustomer.age }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';

export default {
  props: ['id'],
  setup(props) {
    const updatedCustomer = ref({
      name: '',
      email: '',
      age: 0,
    });

    const { mutate: UpdateCustomer, loading, error, result } = useMutation(gql`
      mutation UpdateCustomer($id: ID!, $name: String, $email: String, $age: Int) {
        updateCustomer(id: $id, name: $name, email: $email, age: $age) {
          id
          name
          email
          age
        }
      }
    `);

    const updateCustomer = async () => {
      try {
        const { data } = await UpdateCustomer({
          id: props.id,
          name: updatedCustomer.value.name,
          email: updatedCustomer.value.email,
          age: updatedCustomer.value.age,
        });
        console.log('Customer updated:', data.updateCustomer);
      } catch (error) {
        console.error('Error updating customer:', error.message);
      }
    };

    return {
      updatedCustomer,
      updateCustomer,
      UpdateCustomer,
      loading,
      error,
      result,
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
