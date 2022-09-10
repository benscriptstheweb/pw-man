<script lang="ts">
  import ShiftForm from '../../components/ShiftForm.svelte';
  import ShiftTitle from '../../components/ShiftTitle.svelte';
  import ShiftList from '../../components/ShiftList.svelte';
  import { ToastNotification } from 'carbon-components-svelte';
  import { adminStatus } from '../../stores/publishers';

  let hidden = true;

  const toggleForm = () => {
    hidden = !hidden;
  };

  let success = false;

  const submissionSucceeded = (event) => {
    success = event.detail.success;
    hidden = event.detail.hidden;
  };

  const closeForm = (event) => {
    hidden = event.detail;
  };
</script>

<div class="success">
  {#if success}
    <ToastNotification
      timeout={4000}
      on:close={(e) => {
        e.preventDefault();
        success = !success;
      }}
      lowContrast
      kind="success"
      title="Shift Added!"
      caption="You now have this shift." />
  {/if}
</div>

<div class="content">
  <ShiftTitle adminStatus={$adminStatus} on:formIsOpened={toggleForm} />

  {#if !hidden}
    <ShiftForm
      adminStatus={$adminStatus}
      {toggleForm}
      on:success={submissionSucceeded}
      on:close={closeForm} />
  {/if}
  <ShiftList adminStatus={$adminStatus} />
</div>

<style>
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .success {
    position: absolute;
    z-index: 2;
    top: 0;
    right: 0;
  }
</style>
