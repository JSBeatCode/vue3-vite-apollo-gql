<template>
  <div>
  <h2>Add Customer</h2>
  <form @submit.prevent="funcAddClick" class="mb-3">
    <div class="mb-3">
      <input 
        id="name" 
        type="text"
        v-model="props.customer.name" 
        class="form-control" 
        placeholder="Name" 
        required
        
      />
    </div>
    <div class="mb-3">
      <input 
        id="email" 
        type="email"
        v-model="props.customer.email" 
        class="form-control" 
        placeholder="EmaIl" 
        required
      />
    </div>
    <div class="mb-3">
      <input 
        id="age" 
        type="number"
        v-model="props.customer.age" 
        class="form-control" 
        placeholder="Age" 
        required
      />
    </div>
    <button type="submit" class="btn btn-primary">Add</button>
    <button class="btn btn-danger" @click="funcAddClearClick">Clear</button>
  </form>
</div>
</template>

<script>
export default {
  name: 'ApolloDataAdd',
  props: ['customer'],
  setup(props, {emit}) {

    const funcAddClick = () => {
      emit('funcAdd');
    };
    
    const funcAddClearClick = () => {
      emit('funcAddClear');
    }

    return {
      props,
      funcAddClick,
      funcAddClearClick
      // AddCustomer
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
