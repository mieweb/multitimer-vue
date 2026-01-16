<script setup lang="ts">
import ModalTemplate from "../components/ModalTemplate.vue";
import { activities, billStatuses } from "../data/TimerData";
import { TimerSystem } from "../data/TimerSystem";
import type { Action } from "../components/ModalTemplate.vue";
import type { ModalData } from "../data/ModalHandler";
import HMS from "../data/HMS";

const props = defineProps<{
  modalData: ModalData;
}>();
const formData = {
  timerData: {
    issue: props.modalData.timerData.issue,
    title: props.modalData.timerData.title,
    comment: props.modalData.timerData.comment,
    link: props.modalData.timerData.link,
    activity: props.modalData.timerData.activity,
    billStatus: props.modalData.timerData.billStatus,
  },
  toSubtract: false,
  hoursRef: NaN,
  minutesRef: NaN,
  secondsRef: NaN,
};

const issueLink = `https://pm.mieweb.com/issues/${props.modalData.timerData.issue}`;

const actions: Action[] = [
  {
    action: () => {
      window.open(issueLink, "_blank")?.focus();
    },
    title: "Open Ticket",
    closeModal: true,
    classes: "btn-outline-primary",
    faIconClass: "fa-arrow-up-right-from-square",
  },
  {
    action: () => {
      TimerSystem.editTimer(props.modalData.timerId, formData.timerData);
      let { hoursRef, minutesRef, secondsRef } = formData;
      if (formData.toSubtract) {
        hoursRef = -hoursRef;
        minutesRef = -minutesRef;
        secondsRef = -secondsRef;
      }
      TimerSystem.updateTime(
        props.modalData.timerId,
        HMS.fromHumanReadable(hoursRef, minutesRef, secondsRef)
      );
    },
    title: "Update Timer",
    closeModal: true,
    classes: "btn-primary",
  },
];
</script>
<template>
  <ModalTemplate :actions="actions" title="Timer Details">
    <div class="form-floating mb-3">
      <input
        id="etm-issue"
        v-model="formData.timerData.issue"
        type="number"
        class="form-control modal-focus-input"
        placeholder="New Issue"
        maxlength="6"
      />
      <label for="etm-title">New Issue #</label>
    </div>
    <div class="form-floating">
      <input
        id="etm-title"
        v-model="formData.timerData.title"
        type="text"
        class="form-control"
        placeholder="New Title"
      />
      <label for="etm-title">New Title</label>
    </div>
    <hr />
    <div class="form-check form-switch">
      <input
        id="atim-switch"
        v-model="formData.toSubtract"
        class="form-check-input"
        type="checkbox"
        role="switch"
      />
      <label for="atim-switch">Check to Subtract Time</label>
    </div>
    <div class="input-group">
      <input
        id="atim-hours"
        v-model="formData.hoursRef"
        type="number"
        class="form-control"
        placeholder="Hrs."
      />
      <span class="input-group-text">:</span>
      <input
        id="atim-minutes"
        v-model="formData.minutesRef"
        type="number"
        class="form-control"
        placeholder="Mins."
      />
      <span class="input-group-text">:</span>
      <input
        id="atim-seconds"
        v-model="formData.secondsRef"
        type="number"
        class="form-control"
        placeholder="Secs."
      />
    </div>
    <hr />
    <div class="mb-3">
      <label for="atm-billable" class="form-label">Timer Bill Status</label>
      <select
        id="atm-billable"
        v-model="formData.timerData.billStatus"
        class="form-select"
      >
        <option value="">-- Please Select --</option>
        <option v-for="status of billStatuses" :key="status">
          {{ status }}
        </option>
      </select>
    </div>
    <div class="mb-3">
      <label for="atm-activity" class="form-label">Timer Activity</label>
      <select
        id="atm-activity"
        v-model="formData.timerData.activity"
        class="form-select"
      >
        <option value="">-- Please Select --</option>
        <option v-for="entry of activities" :key="entry.activity">
          {{ entry.activity }}
        </option>
      </select>
    </div>
    <hr />
    <div class="form-floating mb-3">
      <input
        v-model="formData.timerData.comment"
        name="etm-comment"
        type="text"
        class="form-control"
        placeholder="Comment"
      />
      <label for="etm-comment">Comment</label>
    </div>
    <div class="form-floating">
      <input
        v-model="formData.timerData.link"
        name="etm-link"
        type="text"
        class="form-control"
        placeholder="Link"
      />
      <label for="etm-link">Link</label>
    </div>
  </ModalTemplate>
</template>
<script lang="ts">
export default {};
</script>
