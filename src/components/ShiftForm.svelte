<script>
  import { addPublisherToShift, getSignedInUser, sortShifts } from '../controllers/publishers';
  import { publishers } from '../stores/publishers';
  import {
    DatePicker,
    DatePickerInput,
    Form,
    FormGroup,
    Button,
    RadioButton,
    RadioButtonGroup,
    ToastNotification,
    ComboBox,
  } from 'carbon-components-svelte';
  import { onMount, createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import Close from 'carbon-icons-svelte/lib/Close.svelte';
  import { shifts } from '../stores/shifts';
  import { auth } from '../stores/auth';

  export let toggleForm;
  export let adminStatus;

  let dateFieldEmpty = false;
  let timeFieldEmpty = false;
  let publisherFieldEmpty = false;

  let shiftError = false;

  let publisher;
  let date;
  let time;
  let location;

  let shiftExists;

  const dispatch = createEventDispatcher();

  const submitSuccess = () => {
    dispatch('success', {
      success: true,
      hidden: true,
    });
  };

  const closeForm = () => {
    dispatch('close', true);
  };

  const submitForm = async () => {
    let dateTime = new Date(`${date} ${time}`);
    timeFieldEmpty = time === undefined ? true : false;
    dateFieldEmpty = date === '' ? true : false;
    publisherFieldEmpty = publisher === '' ? true : false;

    shiftExists = $shifts
      .filter((e) => e.publisher === publisher.text)
      .some((e) => dateTime.getTime() === e.date.getTime());

    if (!shiftExists) {
      dateTime = new Date(`${date} ${time}`);
      let shiftCreator = $auth.currentUser.uid;
      
      await addPublisherToShift(publisher, dateTime, location, shiftCreator);

      $shifts = [
        {
          id: 'temp',
          email: publisher.email,
          publisher: publisher.text,
          date: dateTime,
          location: location,
          createdBy: shiftCreator
        },
        ...$shifts,
      ];

      sortShifts($shifts);

      time = '';
      date = '';
      publisher = '';

      submitSuccess();
    } else {
      shiftError = true;
    }
  };

  onMount(async () => {
    publisher = await getSignedInUser($auth.currentUser);
  });

  let comboSelection;

  $: if (adminStatus) {
    publisher = $publishers.filter((e) => e.text === comboSelection)[0];
  }
</script>

<div transition:fly={{ y: 80 }} class="shift-form">
  <h4 style="margin-bottom: 20px">
    Add New Shift
    <div on:click={closeForm} class="shift-form-close">
      <Close />
    </div>
  </h4>
  <Form on:submit={(e) => e.preventDefault()}>
    <div class="notification">
      {#if shiftError}
        <ToastNotification
          timeout={4000}
          on:close={(e) => {
            e.preventDefault();
            shiftError = !shiftError;
          }}
          lowContrast
          kind="error"
          title="Shift Already Exists"
          caption="You already have this shift. Please select a different one." />
      {/if}
      {#if timeFieldEmpty}
        <ToastNotification
          timeout={4000}
          on:close={(e) => {
            e.preventDefault();
            timeFieldEmpty = !timeFieldEmpty;
          }}
          lowContrast
          kind="error"
          title="Invalid Date and Time"
          caption="Please check that both date and time fields are valid." />
      {/if}
      {#if publisherFieldEmpty}
        <ToastNotification
          timeout={4000}
          on:close={(e) => {
            e.preventDefault();
            publisherFieldEmpty = !publisherFieldEmpty;
          }}
          lowContrast
          kind="error"
          title="No Publisher Selected"
          caption="Please select a publisher." />
      {/if}
    </div>

    {#if adminStatus}
      <FormGroup legendText="Select a publisher">
        <ComboBox items={$publishers} let:item bind:value={comboSelection}>
          {item.text}
        </ComboBox>
      </FormGroup>
    {/if}

    <FormGroup legendText="Select a date">
      <DatePicker datePickerType="single" bind:value={date}>
        <DatePickerInput invalid={dateFieldEmpty} placeholder="MM/DD/YYYY" />
      </DatePicker>
    </FormGroup>

    <FormGroup legendText="Time slot">
      <RadioButtonGroup bind:selected={time}>
        <RadioButton labelText="10AM - 12PM" value="10:00" />
        <RadioButton labelText="1PM - 3PM" value="13:00" disabled />
      </RadioButtonGroup>
    </FormGroup>

    <FormGroup legendText="Location">
      <RadioButtonGroup bind:selected={location}>
        <RadioButton labelText="American Pinoy" value="American Pinoy" disabled />
        <RadioButton labelText="Sierra Madre" value="Sierra Madre" />
      </RadioButtonGroup>
    </FormGroup>

    <Button type="submit" on:click={submitForm}>Submit</Button>
    <Button
      type="cancel"
      on:click={toggleForm}
      icon={Close}
      iconDescription="Cancel"
      kind="danger-tertiary">Cancel</Button>
  </Form>
</div>

<style>
  .shift-form {
    position: absolute;
    top: 100px;
    z-index: 1;
    width: 350px;
    transition: opacity 0.2s ease-in-out;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    background-color: white;
    padding: 30px;
  }
  .shift-form-close {
    float: right;
    cursor: pointer;
  }
</style>
