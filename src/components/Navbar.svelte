<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Pedestrian from 'carbon-icons-svelte/lib/Pedestrian.svelte';
  import { Tag } from 'carbon-components-svelte';

  export let publisherName: string;
  export let adminStatus = false;

  let dispatch = createEventDispatcher();

  const logoutUser = () => {
    dispatch('loggedOut');
  };
</script>

<div class="btn-group">
  <div id="logout-user" class="btn" on:click={logoutUser}>
    <Pedestrian size={24} />
  </div>
  {#if adminStatus}
    <div class="btn admin-tag">
      <Tag type="green">Admin</Tag>
    </div>
  {:else}
    <div class="btn publisher-tag">
      <Tag type="cyan">{publisherName}</Tag>
    </div>
  {/if}
</div>

<style>
  .btn-group {
    position: fixed;
    top: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    transition: 0.2s;
  }
  .btn {
    margin: 15px;
  }
  #logout-user {
    cursor: pointer;
    padding: 5px;
    border-radius: 10px;
    transition: 0.2s;
  }
  #logout-user:hover {
    transform: scale(1.1);
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
  .admin-tag {
    align-self: flex-end;
  }
</style>
