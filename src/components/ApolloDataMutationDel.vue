<template>
  <div>
    <h2>Delete Customer</h2>
    <button @click="deleteCustomer">Delete</button>
    <div v-if="loading">Deleting...</div>
    <div v-if="error">Error: {{ error.message }}</div>
    <div v-if="deletedCustomerId">Customer with ID {{ deletedCustomerId }} deleted.</div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';

export default {
  props: ['id'],
  setup(props) {
    const deletedCustomerId = ref(null);
    const { mutate: DeleteCustomer, loading, error } = useMutation(gql`
      mutation DeleteCustomer($id: ID!) {
        deleteCustomer(id: $id)
      }
    `);

    const deleteCustomer = async () => {
      try {
        await DeleteCustomer({ id: props.id });
        deletedCustomerId.value = props.id;
      } catch (error) {
        console.error('Error deleting customer:', error.message);
      }
    };

    return {
      deletedCustomerId,
      deleteCustomer,
      DeleteCustomer,
      loading,
      error,
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
