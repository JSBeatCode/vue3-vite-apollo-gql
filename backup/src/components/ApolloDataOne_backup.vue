<template>
  <div>
    <button @click="selectUser('abc-abc-abc')">Select User</button>
    <div v-if="result.value">
      <p>Age: {{ result.value.getCustomer.age }}</p>
      <p>Email: {{ result.value.getCustomer.email }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';

export default {
  setup() {
    const variables = ref({
      id: 'abc-abc-abc',
    });

    const { result } = useQuery(gql`
      query GetCustomer($getCustomerId: ID!) {
        getCustomer(id: $getCustomerId) {
          age
          email
        }
      }
    `, variables);

    function selectUser(id) {
      variables.value = {
        id,
      };
    }

    return {
      result,
      selectUser,
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
