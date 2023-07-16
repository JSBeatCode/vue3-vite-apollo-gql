<template>
  <div>
    <h2>Add Customer</h2>
    <form @submit.prevent="addCustomer">
      <input v-model="newCustomer.name" placeholder="Name" required>
      <input v-model="newCustomer.email" placeholder="Email" required>
      <input v-model.number="newCustomer.age" type="number" placeholder="Age" required>
      <button type="submit">Add</button>
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
    // const state = reactive({
    //   newCustomer: []
    // })

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
        // console.log('jsdno0 debug4-3, state', state);
        // console.log('jsdno0 debug4-4, state.newCustomer', state.newCustomer);
        const val = {
          name: data.addCustomer.name,
          email: data.addCustomer.email,
          age: data.addCustomer.age
        }
        console.log('jsdno0 debug4-1, val before emit', val);
        // location.reload();
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
      AddCustomer
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
