<script>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export default {
  setup () {
    const { result, loading, error, subscribeToMore } = useQuery(gql`
        query GetCustomers {
            getCustomers {
                age
                email
                id
                name
            }
        }
    `)

    // const forRendering = ref('')
    const customers = computed(() => result.value?.users ?? [])

    
    const handleSubscription = () => {
    console.log('jsdno0 debug1-2')
      subscribeToMore({
        document: gql`
          subscription OnCustomerAdded {
            customerAdded {
              age
              email
              id
              name
            }
          }
        `,
        updateQuery: (prev, { subscriptionData }) => {
            console.log('jsdno0 debug1-3')
          if (!subscriptionData.data) return prev;

          const newCustomer = subscriptionData.data.customerAdded;
          customers.value = [...customers.value, newCustomer];
        },
      });
    };

    onMounted(() => {
        console.log('jsdno0 debug1-1')
      customers.value = result.value?.getCustomers ?? [];
      handleSubscription();
    });

    onUnmounted(() => {
      // Unsubscribe from the subscription
      subscription.unsubscribe();
    });
    //----------------------------------------------------------------add
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

        location.reload();
      } catch (error) {
        console.error('Error adding customer:', error.message);
      }
    };
    return {
        customers,
        result,
        loading,
        newCustomer,
        onError,
        addCustomer,
        AddCustomer
    }
  },
}
</script>

<template>
  <!-- <ul>
    <li v-for="user of customers" :key="user.id">
      {{ user.id }} {{ user.name }}
    </li>
  </ul> -->

  <div v-if="loading">Loading...</div>

  <div v-else-if="error">Error: {{ error.message }}</div>

    <ul v-else-if="result && result.getCustomers">
        <li v-for="user of result.getCustomers" :key="user.id">
            {{ user.id }} {{ user.name }}
        </li>
    </ul>

    <ul>
      <li v-for="customer in customers" :key="customer.id">
        {{ customer.id }} {{ customer.name }}
      </li>
    </ul>

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