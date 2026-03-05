<script setup lang="ts">
import ModalTemplate from "../components/ModalTemplate.vue";
import type { Action } from "../components/ModalTemplate.vue";
import {
  activities,
  rawToTimerData,
  RawTimerData,
  billStatuses,
} from "../data/TimerData";
import type { Activity, BillStatus } from "../data/TimerData";
import { reactive, ref, computed } from "vue";
import { TimerSystem } from "../data/TimerSystem";
import { Settings } from "../data/Settings";
import { RedmineAPI } from "../data/RedmineAPI";

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
const showBillStatusError = ref(false);
const showActivityError = ref(false);
const showIssueOrTitleError = ref(false);
const isLoadingFromRedmine = ref(false);
const lastQueriedIssue = ref("");

const issueInputClass = computed(() => {
  let classes = 'form-control modal-focus-input';
  if (showDuplicateWarning.value) classes += ' border-warning duplicate-warning-border';
  if (showIssueOrTitleError.value) classes += ' border-danger validation-error-border';
  return classes;
});

const titleInputClass = computed(() =>
  showIssueOrTitleError.value ? 'form-control border-danger validation-error-border' : 'form-control'
);

const billStatusSelectClass = computed(() =>
  showBillStatusError.value ? 'form-select border-danger validation-error-border' : 'form-select'
);

const activitySelectClass = computed(() =>
  showActivityError.value ? 'form-select border-danger validation-error-border' : 'form-select'
);

const hasIssueOrTitle = computed(() => formData.issue !== "" || formData.title.trim() !== "");
const isBillStatusValid = computed(() => !!formData.billStatus);
const isActivityValid = computed(() => !!formData.activity);
const isFormValid = computed(() => hasIssueOrTitle.value && isBillStatusValid.value && isActivityValid.value);

const onIssueChange = () => {
  showDuplicateWarning.value = false;
  showIssueOrTitleError.value = false;
};

const onIssueBlur = async () => {
  if (!formData.issue || formData.issue === lastQueriedIssue.value) return;
  
  isLoadingFromRedmine.value = true;
  lastQueriedIssue.value = formData.issue.toString();
  
  try {
    const prefilledData = await RedmineAPI.prefillTimerData(formData.issue);
    
    // Pre-fill title if not already set
    if (prefilledData.title && !formData.title) {
      formData.title = prefilledData.title;
    }
    
    // Pre-fill activity if not already set
    if (prefilledData.activity && !formData.activity) {
      formData.activity = prefilledData.activity as Activity;
    }
    
    // Pre-fill billStatus if not already set
    if (prefilledData.billStatus && !formData.billStatus) {
      formData.billStatus = prefilledData.billStatus as BillStatus;
    }
  } catch (error) {
    console.error("Error prefilling from Redmine:", error);
  } finally {
    isLoadingFromRedmine.value = false;
  }
};

const onTitleChange = () => {
  showIssueOrTitleError.value = false;
};

const onBillStatusChange = () => {
  showBillStatusError.value = false;
};

const onActivityChange = () => {
  showActivityError.value = false;
};

const clearFormData = () => {
  formData.issue = "";
  formData.title = "";
  formData.time.hours = NaN;
  formData.time.minutes = NaN;
  formData.time.seconds = NaN;
  formData.comment = "";
  formData.billStatus = "" as BillStatus;
  formData.activity = "" as Activity;
  showDuplicateWarning.value = false;
  showBillStatusError.value = false;
  showActivityError.value = false;
  showIssueOrTitleError.value = false;
};

const actions: Action[] = [
  {
    title: "Split Timer",
    action: () => {
      // Check required fields
      if (!isFormValid.value) {
        if (!hasIssueOrTitle.value) showIssueOrTitleError.value = true;
        if (!isBillStatusValid.value) showBillStatusError.value = true;
        if (!isActivityValid.value) showActivityError.value = true;
        return;
      }

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
      // Check required fields
      if (!isFormValid.value) {
        if (!hasIssueOrTitle.value) showIssueOrTitleError.value = true;
        if (!isBillStatusValid.value) showBillStatusError.value = true;
        if (!isActivityValid.value) showActivityError.value = true;
        return;
      }

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
          :disabled="isLoadingFromRedmine"
          @input="onIssueChange"
          @blur="onIssueBlur"
        />
        <label for="atm-issue" class="form-label">Issue #</label>
      </div>
      <div v-if="isLoadingFromRedmine" class="text-info small mb-3">
        <span class="spinner-border spinner-border-sm me-2"></span>Searching Redmine...
      </div>
      <div v-else-if="showDuplicateWarning" class="text-warning small mb-3">
        Duplicate ticket number, click Add Timer again if you want to add.
      </div>
      <div v-else class="mb-2"></div>
      <div class="form-floating mb-1">
        <input
          id="atm-title"
          v-model.trim="formData.title"
          type="text"
          :class="titleInputClass"
          placeholder="title"
          @input="onTitleChange"
        />
        <label for="atm-title" class="form-label">Timer Title</label>
      </div>
      <div v-if="showIssueOrTitleError" class="text-danger small mb-3">
        Either a ticket number or title is required.
      </div>
      <div v-else class="mb-3"></div>
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
          :class="billStatusSelectClass"
          @change="onBillStatusChange"
        >
          <option value="">-- Please Select --</option>
          <option v-for="status in billStatuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
        <div v-if="showBillStatusError" class="text-danger small mt-1">
          Please select a bill status.
        </div>
      </div>
      <div class="mb-3">
        <label for="atm-activity" class="form-label">Timer Activity</label>
        <select
          id="atm-activity"
          v-model="formData.activity"
          :class="activitySelectClass"
          @change="onActivityChange"
        >
          <option value="">-- Please Select --</option>
          <option v-for="entry of activities" :key="entry.activity">
            {{ entry.activity }}
          </option>
        </select>
        <div v-if="showActivityError" class="text-danger small mt-1">
          Please select an activity.
        </div>
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

.validation-error-border {
  border-width: 2px !important;
}

.text-warning.small {
  font-size: 0.75rem;
}

.text-danger.small {
  font-size: 0.75rem;
}
</style>
