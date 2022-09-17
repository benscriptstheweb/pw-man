<script>
  import { Column, Grid, Row, ToastNotification } from 'carbon-components-svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import PedestrianFamily from 'carbon-icons-svelte/lib/PedestrianFamily.svelte';
  import { deleteShift, getSignedInUser } from '../controllers/publishers';
  import { shifts } from '../stores/shifts';
  import { auth } from '../stores/auth';
  import FleetList from './FleetList.svelte';
  import debounce from 'debounce';
  import Confirm from './Confirm.svelte';

  export let adminStatus = false;

  let idToDelete;
  let error = false;

  const removeShift = () => {
    try {
      toggleConfirmDelete();

      debounce(deleteShift(idToDelete), 3000);

      const indexOfId = $shifts.findIndex((e) => e.id === idToDelete);
      $shifts.splice(indexOfId, 1);

      setTimeout(() => {
        $shifts = $shifts;
      }, 500);
    } catch (error) {
      error = true;
    }
  };

  let confirmVisible;

  const toggleConfirmDelete = () => {
    confirmVisible = !confirmVisible;
  };

  const confirmDelete = async (shift) => {
    const publisher = await getSignedInUser($auth.currentUser);

    if ($auth.currentUser.uid === shift.createdBy || publisher.role === 0) {
      toggleConfirmDelete();
      idToDelete = shift.id;
    } else {
      error = true;
      throw new Error('Unauthorized deletion.');
    }
  };

  let fleetHidden = true;
  let date;
  let location;

  const toggleFleetView = () => {
    fleetHidden = !fleetHidden;
  };

  const closeFleetView = (event) => {
    fleetHidden = event.detail;
  };

  const showShiftFleet = (rowDate, rowLocation) => {
    date = rowDate;
    location = rowLocation;

    toggleFleetView();
  };

  $: sortedShifts = () =>
    adminStatus ? $shifts : $shifts.filter((e) => e.email === $auth.currentUser?.email);
</script>

<div class="error">
  {#if error}
    <ToastNotification
      timeout={4000}
      on:close={(e) => {
        e.preventDefault();
        error = !error;
      }}
      lowContrast
      kind="error"
      title="Could not delete."
      caption="Make sure that this is your shift." />
  {/if}
</div>

{#if confirmVisible}
  <Confirm on:deleteConfirmed={removeShift} on:closeForm={toggleConfirmDelete} />
{/if}

{#if !fleetHidden}
  <FleetList {date} {location} on:close={closeFleetView} />
{/if}

{#if sortedShifts().length !== 0}
  <div class="data-table">
    <Grid padding>
      {#each sortedShifts() as shift}
        <div class="date">
          {`${shift.date.getMonth() + 1}/${shift.date.getDate()}`}
        </div>
        <Row>
          {#if adminStatus}
            <Column>{shift.publisher}</Column>
          {/if}
          <Column
            >{shift.date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}</Column>
          <Column>{shift.location}</Column>
          <div class="shift-btn-group">
            <div on:click={() => confirmDelete(shift)} class="btn delete-row">
              <TrashCan />
            </div>
            <div on:click={() => showShiftFleet(shift.date, shift.location)} class="btn expand-row">
              <PedestrianFamily />
            </div>
          </div>
        </Row>
        <hr />
      {/each}
    </Grid>
  </div>
{:else}
  <p class="msg-no-shift">You do not have any shifts. Click on the + button to add a new one.</p>
{/if}

<style>
  .msg-no-shift {
    color: gray;
    max-width: 85%;
  }
  .data-table::-webkit-scrollbar {
    display: none;
  }
  .data-table {
    -ms-overflow-style: none;
    overflow: scroll;
    max-height: 400px;
    max-width: 550px;
    margin: 0 auto;
    background-color: rgb(237, 237, 237);
    padding: 20px;
  }
  .shift-btn-group {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .btn {
    padding: 10px;
    border-radius: 10px;
  }
  .btn:hover {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    transform: scale(1.1);
  }
  .delete-row {
    cursor: pointer;
    color: rgb(255, 137, 137);
    transition: 0.2s;
  }
  .expand-row {
    cursor: pointer;
    color: black;
    transition: 0.2s;
  }
  .delete-row:hover {
    color: white;
    background-color: rgb(255, 137, 137);
  }
  .expand-row:hover {
    color: white;
    background-color: black;
  }

  .date {
    margin-top: 30px;
    font-weight: bold;
  }

  .error {
    position: absolute;
    z-index: 2;
    top: 0;
    right: 0;
  }
</style>
