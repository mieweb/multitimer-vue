<script setup lang="ts">
import { ref } from 'vue';
import ModalTemplate from '../components/ModalTemplate.vue';
import Action from '../data/Action';
import { TimerSystem } from '../data/TimerSystem';
import TimerInterface from '../data/TimerInterface';
const formElement = ref<HTMLFormElement>();
const formData = {
    issue: '',
    title: '',
    link: ''
};
const addFormData = (timerData: TimerInterface) => {
    formData.issue = timerData.issue!;
    formData.title = timerData.title!;
    formData.link = timerData.link!;
};
const clearFormData = () => {
    formData.issue = '';
    formData.title = '';
    formData.link = '';
};
const actions: Action[] = [
    {
        title: 'Update Timer',
        action: () => {
            const issueElem = document.querySelector('#etm-issue') as HTMLInputElement;
            const titleElem = document.querySelector('#etm-title') as HTMLInputElement;
            const linkElem = document.querySelector('#etm-link') as HTMLInputElement;
            TimerSystem.editTimer({
                issue: issueElem.value,
                title: titleElem.value,
                link: linkElem.value
            });
            //@ts-ignore
            formElement.value.reset();
            clearFormData();
        },
        closeModal: true,
        classes: 'btn-primary'
    }
];
addFormData(TimerSystem.selectedTimerData()!);
</script>
<template>
    <ModalTemplate :actions="actions" :modalId="'edit-timer-modal'" :title="'Edit Timer'">
        <form ref="formElement">
            <div class="modal-body">
                <div class="form-floating mb-3">
                    <input
                        type="number"
                        class="form-control"
                        id="etm-issue"
                        placeholder="New Issue"
                        maxlength="6"
                        :value="formData.issue"
                    />
                    <label for="etm-title">New Issue #</label>
                </div>
                <div class="form-floating mb-3">
                    <input
                        type="text"
                        class="form-control"
                        id="etm-title"
                        placeholder="New Title"
                        :value="formData.title" />
                    <label for="etm-title">New Title</label>
                </div>
                <div class="form-floating mb-3">
                    <input
                        type="text"
                        class="form-control"
                        id="etm-link"
                        placeholder="New Link"
                        :value="formData.link"
                    />
                    <label for="etm-link">New Meeting Link</label>
                </div>
            </div>
        </form>
    </ModalTemplate>
</template>
<script lang="ts">export default {};</script>