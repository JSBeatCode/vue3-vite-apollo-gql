<template>
  <div>
    <h2>Update Customer</h2>
    <form @submit.prevent="funcUpdateClick" class="mb-3">
      <div class="mb-3">
        <input 
          id="id" 
          type="text" 
          v-model="props.customer.id" 
          class="form-control" 
          placeholder="Id" 
          required 
          readonly
        />
      </div>
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
          placeholder="Email" 
          required
        />
      </div>
      <div class="mb-3">
        <input 
          id="age" 
          type="number" 
          v-model.number="props.customer.age" 
          class="form-control" 
          placeholder="Age" 
          required 
        />
      </div>
     
      <button type="submit" class="btn btn-primary">Update</button>
      <button class="btn btn-danger" @click="funcUpdateClearClick">Clear</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ApolloDataMutationUpdate',
  props:['customer'],
  setup(props, {emit}) {

    const funcUpdateClick = () => {
      console.log('--jsdno0 debug funcUpdateClick')
      emit('funcUpdate');
    };
    
    const funcUpdateClearClick = () => {
      console.log('--jsdno0 debug funcUpdateClearClick')
      emit('funcUpdateClear');
    }


    return {
      funcUpdateClick,
      funcUpdateClearClick,
      props
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
