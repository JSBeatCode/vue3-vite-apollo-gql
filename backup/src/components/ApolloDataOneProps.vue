<template>
  <div>
    <div v-if="result.loading">Loading...</div>
    <div v-else-if="result.error">Error: {{ result.error.message }}</div>
    <div v-else>
      <p>ID: {{ result.value.user.id }}</p>
      <p>Email: {{ result.value.user.email }}</p>
    </div>
  </div>
</template>

<script>
import { useQuery } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';

export default {
  props: ['id'],

  setup(props) {
    const { result } = useQuery(gql`
      query getUserById($id: ID!) {
        user(id: $id) {
          id
          email
        }
      }
    `, () => ({
      id: props.id,
    }));

    return {
      result,
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
