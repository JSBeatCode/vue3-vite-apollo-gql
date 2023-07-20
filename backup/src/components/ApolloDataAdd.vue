<template>
    <div>
    <h2>Add Customer</h2>
    <form @submit.prevent="addCustomer" class="mb-3">
      <div class="mb-3">
        <!-- <input v-model="" class="form-control" placeholder="Name" required> -->
      </div>
      <div class="mb-3">
        <!-- <input v-model="" class="form-control" placeholder="Email" required> -->
      </div>
      <div class="mb-3">
        <!-- <input v-model.number="" type="number" class="form-control" placeholder="Age" required> -->
      </div>
      <button type="submit" class="btn btn-primary">Add</button>
    </form>
</div>
</template>

<script>
import { ref, onMounted, onUpdated, reactive } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { gql } from 'graphql-tag';

export default {
  name: 'ApolloDataAdd',
    props: {
        
    },
  setup(props, {emit}) {



    return {
      
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
