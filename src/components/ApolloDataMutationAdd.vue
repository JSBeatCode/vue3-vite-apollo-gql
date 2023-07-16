<template>
    <div>
    <h2>Add Customer</h2>
    <form @submit.prevent="addCustomer" class="mb-3">
      <div class="mb-3">
        <input v-model="newCustomer.name" class="form-control" placeholder="Name" required>
      </div>
      <div class="mb-3">
        <input v-model="newCustomer.email" class="form-control" placeholder="Email" required>
      </div>
      <div class="mb-3">
        <input v-model.number="newCustomer.age" type="number" class="form-control" placeholder="Age" required>
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
  name: 'ApolloDataMutationAdd',
    props: {
        
    },
  setup(props, {emit}) {
    const newCustomer = ref({
      name: '',
      email: '',
      age: 0,
    });
    
    const { mutate: AddCustomer, onError } = useMutation(gql`
      mutation AddCustomer($name: String!, $email: String!, $age: Int!) {
        addCustomer(name: $name, email: $email, age: $age) {
          id
          name
          email
          age
        }
      }
    `);

    onError((error) => {
      console.error('GraphQL Error:', error.message);
    });

    const addCustomer = async () => {
      try {
        const { data } = await AddCustomer({
          name: newCustomer.value.name,
          email: newCustomer.value.email,
          age: newCustomer.value.age,
        });
        console.log('Customer added:', data.addCustomer);
        // 추가된 고객을 처리하는 로직 추가
        newCustomer.value.name = '';
        newCustomer.value.email = '';
        newCustomer.value.age = 0;

        // state.newCustomer.push[]
        const val = {
          id: data.addCustomer.id,
          name: data.addCustomer.name,
          email: data.addCustomer.email,
          age: data.addCustomer.age
        }

        emit('funcAdd', val);
      } catch (error) {
        console.error('Error adding customer:', error.message);
      }
    };

    onUpdated(()=>{
      // console.log("Add 페이지 state의 변화가 있을 때마다 updated", newCustomer)
    })

    onMounted(()=>{
      // console.log("Add 페이지 새로 시작할때마다 mounted", newCustomer)
    })

    return {
      newCustomer,
      onError,
      addCustomer,
      // AddCustomer
    };
  },
    emits: [
        // 'funcChange',
    'funcAdd'
    // , 'funcKeyDown'
    ]
};
</script>

<style lang="scss" scoped>

</style>
