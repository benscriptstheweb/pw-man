<script>
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import Close from 'carbon-icons-svelte/lib/Close.svelte';
  import { shifts } from '../stores/shifts';
  import { Column, Grid, Row } from 'carbon-components-svelte';

  export let date;
  export let location;

  const dispatch = createEventDispatcher();

  const closeForm = () => {
    dispatch('close', true);
  };

  const userShiftFleet = () => $shifts.filter((e) => Number(e.date) === Number(date));
</script>

<div transition:fly={{ y: 80 }} class="shift-fleet">
  <div class="shift-banner">
    <h3>
      {location}
      <div on:click={closeForm} class="shift-fleet-close">
        <Close size={24} />
      </div>
    </h3>
    <h5>
      {`${date.getMonth() + 1}/${date.getDate()}`}
    </h5>
  </div>

  <div class="data-table">
    <Grid padding>
      {#each userShiftFleet() as shift}
        <div class="data-row">
          <Row>
            <Column
              >{shift.date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}</Column>
            <Column>{shift.publisher}</Column>
          </Row>
        </div>
      {/each}
    </Grid>
  </div>
</div>

<style>
  .shift-fleet {
    position: absolute;
    top: 10%;
    z-index: 1;
    width: 370px;
    transition: opacity 0.2s ease-in-out;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    background-color: white;
    padding-bottom: 30px;
  }
  .shift-banner {
    background-color: black;
    color: white;
    padding: 30px;
  }
  .shift-fleet h3 {
    font-weight: bold;
  }
  .shift-fleet-close {
    float: right;
    cursor: pointer;
  }
  .data-table::-webkit-scrollbar {
    display: none;
  }
  .data-table {
    -ms-overflow-style: none;
    overflow: scroll;
    max-height: 400px;
    margin: 20px auto 0 auto;
    padding: 0px 20px;
  }
  .data-row {
    border-bottom: 1px solid white;
  }
</style>
