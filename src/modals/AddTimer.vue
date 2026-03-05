<script setup lang="ts">
import ModalTemplate from "../components/ModalTemplate.vue";
import type { Action } from "../components/ModalTemplate.vue";
import {
  activities,
  rawToTimerData,
  RawTimerData,
  billStatuses,
} from "../data/TimerData";
import { reactive, ref, computed } from "vue";
import { TimerSystem } from "../data/TimerSystem";
import { Settings } from "../data/Settings";

defineEmits(["addTimer", "splitTimer"]);

const formData: Omit<RawTimerData, "controlsHidden" | "lastUsed"> = reactive({
  issue: "",
  title: "",
  time: {
    hours: NaN,
    minutes: NaN,
    seconds: NaN,
  },
  billStatus: "" as unknown as string,
  comment: "",
  link: "",
  activity: "" as unknown as string,
} as unknown as Omit<RawTimerData, "controlsHidden" | "lastUsed">);

const showDuplicateWarning = ref(false);
const issueInputClass = computed(() => 
  showDuplicateWarning.value ? 'form-control modal-focus-input border-warning duplicate-warning-border' : 'form-control modal-focus-input'
);

const onIssueChange = () => {
  showDuplicateWarning.value = false;
};

const clearFormData = () => {
  formData.issue = "";
  formData.title = "";
  formData.time.hours = NaN;
  formData.time.minutes = NaN;
  formData.time.seconds = NaN;
  formData.comment = "";
  showDuplicateWarning.value = false;
};

const actions: Action[] = [
  {
    title: "Split Timer",
    action: () => {
      const force = showDuplicateWarning.value;
      const success = TimerSystem.splitTimer(rawToTimerData(formData), force);
      
      if (!success && !force) {
        showDuplicateWarning.value = true;
      } else {
        clearFormData();
      }
    },
    closeModal: false,
  },
  {
    title: "Add Timer",
    action: () => {
      const force = showDuplicateWarning.value;
      const success = TimerSystem.addTimer(rawToTimerData(formData), force);
      
      if (!success && !force) {
        showDuplicateWarning.value = true;
      } else {
        clearFormData();
      }
    },
    classes: "btn-primary",
    hotkey: "Enter",
  },
];
</script>

<template>
  <ModalTemplate title="Add Timer" :actions="actions">
    <form>
      <div class="form-floating mb-1">
        <input
          id="atm-issue"
          v-model="formData.issue"
          type="number"
          :class="issueInputClass"
          placeholder="issue"
          @input="onIssueChange"
        />
        <label for="atm-issue" class="form-label">Issue #</label>
      </div>
      <div v-if="showDuplicateWarning" class="text-warning small mb-3">
        Duplicate ticket number, click Add Timer again if you want to add.
      </div>
      <div v-else class="mb-2"></div>
      <div class="form-floating mb-3">
        <input
          id="atm-title"
          v-model.trim="formData.title"
          type="text"
          class="form-control"
          placeholder="title"
        />
        <label for="atm-title" class="form-label">Timer Title</label>
      </div>
      <div class="input-group mb-3">
        <input
          id="atm-hours"
          v-model="formData.time.hours"
          type="number"
          class="form-control"
          placeholder="Hrs."
        />
        <span class="input-group-text">:</span>
        <input
          id="atm-minutes"
          v-model="formData.time.minutes"
          type="number"
          class="form-control"
          placeholder="Mins."
        />
        <span class="input-group-text">:</span>
        <input
          id="atm-seconds"
          v-model="formData.time.seconds"
          type="number"
          class="form-control"
          placeholder="Secs."
        />
      </div>
      <div class="mb-3">
        <label for="atm-billable" class="form-label">Timer Bill Status</label>
        <select
          id="atm-billable"
          v-model="formData.billStatus"
          class="form-select"
        >
          <option value="">-- Please Select --</option>
          <option v-for="status in billStatuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>
      <div class="mb-3">
        <label for="atm-activity" class="form-label">Timer Activity</label>
        <select
          id="atm-activity"
          v-model="formData.activity"
          class="form-select"
        >
          <option value="">-- Please Select --</option>
          <option v-for="entry of activities" :key="entry.activity">
            {{ entry.activity }}
          </option>
        </select>
      </div>
      <div class="form-floating mb-3">
        <input
          id="atm-comment"
          v-model.trim="formData.comment"
          type="text"
          class="form-control"
          placeholder="comment"
        />
        <label for="timer-comment" class="form-label">Timer Comment</label>
      </div>
      <div class="form-floating mb-3">
        <input
          id="atm-link"
          v-model.trim="formData.link"
          type="text"
          class="form-control"
          placeholder="meeting link"
        />
        <label for="timer-link" class="form-label">Timer Meeting Link</label>
      </div>
    </form>
  </ModalTemplate>
</template>
<script lang="ts">
export default {};
</script>
<style scoped>
.duplicate-warning-border {
  border-width: 3px !important;
}

.text-warning.small {
  font-size: 0.75rem;
}
</style>
import Action from "../data/Action.1";
