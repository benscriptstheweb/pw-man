<script>
  import { Button } from 'carbon-components-svelte';
  import Close from 'carbon-icons-svelte/lib/Close.svelte';
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  let dispatch = createEventDispatcher();

  const confirmDeletion = () => {
    dispatch('deleteConfirmed');
  };

  const closeForm = () => {
    dispatch('closeForm');
  };
</script>

<div transition:fly={{ y: 80 }} class="confirm-box">
  <h3 class="confirm-title">
    Delete Shift
    <div on:click={closeForm} class="shift-form-close">
      <Close />
    </div>
  </h3>
  <p class="confirm-text">Are you sure you want to delete this shift?</p>
  <div class="confirm-btn">
    <Button on:click={confirmDeletion} kind="danger">Confirm</Button>
  </div>
</div>

<style>
  .confirm-box {
    position: absolute;
    top: 100px;
    height: 230px;
    background-color: black;
    color: white;
    transition: opacity 0.2s ease-in-out;
    padding: 30px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
  .confirm-btn {
    margin-bottom: 30px;
  }
  .confirm-title {
    font-weight: bold;
  }
  .confirm-text {
    padding: 30px 0;
  }
  .shift-form-close {
    float: right;
    cursor: pointer;
  }
</style>
