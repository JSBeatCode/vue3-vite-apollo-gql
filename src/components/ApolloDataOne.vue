<template>
  <div>
    <div v-if="result.loading">Loading...</div>
    <div v-else-if="result.error">Error: {{ result.error.message }}</div>
    <div v-else>
      <p>ID: {{ result.value.getCustomer.id }}</p>
      <p>Email: {{ result.value.getCustomer.email }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';

export default {
  props: ['id'],
  setup(props) {
    const { result } = useQuery(gql`
      query GetCustomer($id: ID!) {
        getCustomer(id: $id) {
          id
          email
        }
      }
    `
    , {
      id: ref(props.id),
    }
    // , () => ({
    //   id: props.id,
    // })
    );

    return {
      result,
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
